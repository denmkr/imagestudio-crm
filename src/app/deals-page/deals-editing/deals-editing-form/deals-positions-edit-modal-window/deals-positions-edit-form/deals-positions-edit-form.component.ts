import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { DealsItemsEditModalWindowComponent } from './deals-items-edit-modal-window/deals-items-edit-modal-window.component';
import { DealsItemsAddModalWindowComponent } from '../../../../deals-creating/deals-creating-form/deals-positions-add-modal-window/deals-positions-add-form/deals-items-add-modal-window/deals-items-add-modal-window.component';
import { WarehouseService } from '../../../../../warehouse-page/warehouse.service';
import { DealsService } from '../../../../deals.service';
import { DatepickerOptions } from 'ng2-datepicker/dist/src/ng-datepicker/component/ng-datepicker.component';
import * as ruLocale from 'date-fns/locale/ru';

@Component({
  selector: 'deals-positions-edit-form',
  templateUrl: './deals-positions-edit-form.component.html',
  styleUrls: ['./deals-positions-edit-form.component.css'],
  providers: [ WarehouseService, DealsService ]
})
export class DealsPositionsEditFormComponent implements OnInit {

  options: DatepickerOptions = {
    barTitleIfEmpty: 'Выберите месяц и день',
    minYear: 2016,
    placeholder: '01.01.2018',
    displayFormat: 'D.MM.YYYY',
    firstCalendarDay: 1,
    locale: ruLocale,
  };

  @ViewChild(DealsItemsEditModalWindowComponent) dealsItemsEditModalWindowComponent: DealsItemsEditModalWindowComponent;
  @ViewChild(DealsItemsAddModalWindowComponent) dealsItemsAddModalWindowComponent: DealsItemsAddModalWindowComponent;

  @HostBinding('class.active') activeClass: boolean = false;
  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;
  bigWindow = true;

  public products = [];

  itemStatusForm: FormGroup;
  itemStatus: FormControl;
  public itemStatusSelect = {name: "itemStatus", placeholder: "Статус", id: "itemStatusSelect"};

  public selectInputs = [
    {name: "product", placeholder: "Выберите товар", title: "Товар", items: "products", id: "productsSelect", typeahead: "productsTypeahead"}
  ];

  public selects = [
    {items: "statuses", name: "status", placeholder: "Статус", id: "statusSelect"},
  ];

  public statuses = [];
  public position_items = [];

  public inputs = [
    {name: "amount", type: "text", inline: true, title: "Количество", tiny: true},
    {name: "cost", type: "text", inline: true, title: "Себес.", tiny: true, smallTitle: true, readonly: true},
    {name: "price", type: "text", inline: true, title: "Продаж.", tiny: true, smallTitle: true}
  ];

  public dateInputs = [
    {name: "deadline", type: "text", placeholder: "10 янв. 2017", title: "Дедлайн", small: true},
  ];

  addProductTag(name) {
    return { id: null, name: name };
  }

  editDealsPositionForm: FormGroup;

  id: number;
  orderId: number;
  status: FormControl;
  product: FormControl;
  cost: FormControl;
  price: FormControl;
  amount: FormControl;
  deadline: FormControl;

  @Output() refreshOrderPositions = new EventEmitter<any>();
  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  remove() {
    this.dealsService.removePositionById(this.id).subscribe(result => {
      let order_position = this.editDealsPositionForm.value;
      this.refreshOrderPositions.emit(order_position);
    });
  }

  addNewDealsItem() {
    this.dealsItemsAddModalWindowComponent.showForPosition(this.id);
  }

  editDealsItem(item) {
    this.dealsItemsEditModalWindowComponent.showWithData(item, this.id);
  }

  addPositionItems(event) {
    this.refreshItems();
    // this.position_items.push(event);
  }

  refreshItems() {
    this.dealsService.getPositionById(this.id.toString()).subscribe(result => {
      this.position_items = result.orders_position.orders_items;
      this.cost.setValue(result.orders_position.prime_price);
    });
  }

  editDealsPosition() {
    let order_position = this.editDealsPositionForm.value;
    order_position.items = this.position_items;

    let product_id = this.product.value.id;

    if (product_id == null) {
      this.warehouseService.createProduct(this.product.value.name).subscribe(product => {
        let positionForm = {
          orderId: this.orderId,
          product: product,
          price: this.price.value,
          prime_price: this.cost.value,
          full_price: this.amount.value * this.cost.value,
          profit: (this.amount.value * this.price.value) - (this.amount.value * this.cost.value),
          count: this.amount.value,
          orders_items: this.position_items,
          must_be_finished_at: this.deadline.value
        };
        
        this.dealsService.editPositionById(this.id, positionForm.must_be_finished_at, positionForm.product.id, positionForm.orderId, positionForm.price, positionForm.count).subscribe(result => {
          this.refreshOrderPositions.emit(order_position);
        });
      });
    }
    else {
      let positionForm = {
        orderId: this.orderId,
        product: this.product.value,
        price: this.price.value,
        prime_price: this.cost.value,
        full_price: this.amount.value * this.cost.value,
        profit: (this.amount.value * this.price.value) - (this.amount.value * this.cost.value),
        count: this.amount.value,
        orders_items: this.position_items,
        must_be_finished_at: this.deadline.value
      };
      
      this.dealsService.editPositionById(this.id, positionForm.must_be_finished_at, positionForm.product.id, positionForm.orderId, positionForm.price, positionForm.count).subscribe(result => {
        this.refreshOrderPositions.emit(order_position);
      });
    }
  }

  productsTypeahead = new EventEmitter<string>();

  private serverSideSearchForProducts() {
    this.productsTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.warehouseService.getProducts(term))
    ).subscribe(x => {
        this.cd.markForCheck();
        this.products = x;
    }, (err) => {
        console.log(err);
        this.products = [];
    });
  }

  constructor(private activatedRoute: ActivatedRoute, private router: Router, public formbuilder: FormBuilder, private elRef: ElementRef, private warehouseService: WarehouseService, private dealsService: DealsService, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  addNewProduct(name) {
    this.warehouseService.createProduct(name).subscribe(product => {
      let fieldProduct = {
        id: product.id,
        text: product.name
      };
      this.product.setValue(fieldProduct);
    });
  }

  updateData(position) {
    console.log(position);
    this.position_items = position.orders_items;
    this.id = position.id;
    this.product.setValue(position.product);
    this.status.setValue(position.status.id);
    this.statuses = position.available_events;
    this.cost.setValue(position.prime_price);
    this.price.setValue(position.price);
    this.deadline.setValue(position.must_be_finished_at);
    this.amount.setValue(position.count);
  }

  changeItemStatus(id, event) {
    this.dealsService.updateItemStatusById(event.id, id).subscribe(
      result => {
        console.log(result);
        this.refreshItems();
        // this.itemStatusForm.reset();
        // this.showAllDeals();
      }
    );
  }

  changePositionStatus(event) {
    this.dealsService.updatePositionStatusByOrderId(event.id, this.id.toString()).subscribe(
      result => {
        console.log(result);
        // this.itemStatusForm.reset();
        // this.showAllDeals();
      }
    );
  }

  ngOnInit() {
    this.itemStatus = new FormControl('', [
      Validators.required
    ]);

    this.itemStatusForm = new FormGroup({
      itemStatus: this.itemStatus
    });

    this.itemStatusForm.reset();


    this.activatedRoute.queryParams.subscribe(params => {
      this.orderId = parseInt(params['id']);
    });

    this.serverSideSearchForProducts();

    this.status = new FormControl('', [
      Validators.required
    ]);
    this.product = new FormControl('', [
      Validators.required
    ]);
    this.cost = new FormControl('', [
      Validators.required
    ]);
    this.price = new FormControl('', [
      Validators.required
    ]);
    this.amount = new FormControl('', [
      Validators.required
    ]);
    this.deadline = new FormControl('', [
      Validators.required
    ]);

    this.editDealsPositionForm = new FormGroup({
      status: this.status,
      product: this.product,
      cost: this.cost,
      price: this.price,
      amount: this.amount,
      deadline: this.deadline
    });

    this.editDealsPositionForm.reset();
  }

}

