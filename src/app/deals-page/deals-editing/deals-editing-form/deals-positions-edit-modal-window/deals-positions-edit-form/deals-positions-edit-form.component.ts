import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { DealsItemsEditModalWindowComponent } from './deals-items-edit-modal-window/deals-items-edit-modal-window.component';
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
    barTitleIfEmpty: 'Выберите дату',
    minYear: 2016,
    placeholder: '01.01.2018',
    displayFormat: 'D.MM.YYYY',
    firstCalendarDay: 1,
    locale: ruLocale,
  };

  @ViewChild(DealsItemsEditModalWindowComponent) dealsItemsEditModalWindowComponent: DealsItemsEditModalWindowComponent;
  @HostBinding('class.active') activeClass: boolean = false;
  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;
  bigWindow = true;

  public products = [];

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
    {name: "cost", type: "text", inline: true, title: "Себес.", tiny: true, smallTitle: true},
    {name: "price", type: "text", inline: true, title: "Продаж.", tiny: true, smallTitle: true}
  ];

  public dateInputs = [
    {name: "deadline", type: "text", placeholder: "10 янв. 2017", title: "Дедлайн", small: true},
  ]

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

  addNewDealsItem() {
    this.dealsItemsEditModalWindowComponent.show();
  }

  addPositionItems(event) {
    this.position_items.push(event);
  }

  editDealsPosition() {
    let order_position = this.editDealsPositionForm.value;
    order_position.items = this.position_items;

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
    this.id = position.id;
    this.product.setValue(position.product);
    this.status.setValue(position.status.id);
    this.statuses = position.available_events;
    this.cost.setValue(position.prime_price);
    this.price.setValue(position.price);
    this.deadline.setValue(position.must_be_finished_at);
    this.amount.setValue(position.count);
  }

  ngOnInit() {
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

