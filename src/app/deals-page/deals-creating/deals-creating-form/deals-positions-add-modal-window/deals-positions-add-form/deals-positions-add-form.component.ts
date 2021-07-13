import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { DealsItemsAddModalWindowComponent } from './deals-items-add-modal-window/deals-items-add-modal-window.component';
import { WarehouseService } from '../../../../../warehouse-page/warehouse.service';
import { DealsService } from '../../../../deals.service';
import { DatepickerOptions } from 'ng2-datepicker/dist/src/ng-datepicker/component/ng-datepicker.component';
import * as ruLocale from 'date-fns/locale/ru';

@Component({
  selector: 'deals-positions-add-form',
  templateUrl: './deals-positions-add-form.component.html',
  styleUrls: ['./deals-positions-add-form.component.css'],
  providers: [ WarehouseService, DealsService ]
})
export class DealsPositionsAddFormComponent implements OnInit {

  options: DatepickerOptions = {
    barTitleIfEmpty: 'Выберите месяц и день',
    minYear: 2016,
    placeholder: '01.01.2018',
    displayFormat: 'D.MM.YYYY',
    firstCalendarDay: 1,
    locale: ruLocale,
  };

  currentDate: any;

  @ViewChild('notFound') notFound: ElementRef;

  @ViewChild(DealsItemsAddModalWindowComponent) dealsItemsAddModalWindowComponent: DealsItemsAddModalWindowComponent;
  @HostBinding('class.active') activeClass: boolean = false;
  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;
  bigWindow = true;

  public products = [];

  public selectInputs = [
    {name: "product", placeholder: "Выберите товар", title: "Товар", items: "products", id: "productsSelect", typeahead: "productsTypeahead"}
  ];

  public statuses = [
    {name: 'Новое', id: 'new'}, 
    {name: 'Лид', id: 'lead'},
    {name: 'В работе', id: 'work'},
    {name: 'Долг', id: 'debt'},
    {name: 'Сделано', id: 'done'},
    {name: 'Слив', id: 'dumb'}
  ];

  public position_items = [];

  public inputs = [
    {name: "amount", type: "text", inline: true, title: "Количество", tiny: true},
    {name: "cost", type: "text", inline: true, title: "Себес.", tiny: true, smallTitle: true, readonly: true, placeholder: "0"},
    {name: "price", type: "text", inline: true, title: "Продаж.", tiny: true, smallTitle: true}
  ];

  public dateInputs = [
    {name: "deadline", type: "text", placeholder: "10 янв. 2017", title: "Дедлайн", small: true},
  ]

  newDealsPositionForm: FormGroup;

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
    this.dealsItemsAddModalWindowComponent.show();
  }

  addProductTag(name) {
    return { id: null, name: name };
  }

  addPositionItems(event) {
    this.position_items.push(event);

    let first_price: number = 0;
    this.position_items.map(position_item => {
      first_price += parseInt(position_item.prime_price);
    });
    this.cost.setValue(first_price);
  }

  addDealsPositions() {
    let product_id = this.product.value.id;

    if (product_id == null) {
      this.warehouseService.createProduct(this.product.value.name).subscribe(product => {

        let positionForm = {
          product: product,
          price: this.price.value,
          prime_price: this.cost.value,
          full_price: this.amount.value * this.cost.value,
          profit: (this.amount.value * this.price.value) - (this.amount.value * this.cost.value),
          count: this.amount.value,
          orders_items: this.position_items,
          must_be_finished_at: this.deadline.value
        };
        
        this.refreshOrderPositions.emit(positionForm);
      });
    }
    else {
      let positionForm = {
        product: this.product.value,
        price: this.price.value,
        prime_price: this.cost.value,
        full_price: this.amount.value * this.cost.value,
        profit: (this.amount.value * this.price.value) - (this.amount.value * this.cost.value),
        count: this.amount.value,
        orders_items: this.position_items,
        must_be_finished_at: this.deadline.value
      };
      
      this.refreshOrderPositions.emit(positionForm);
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

  constructor(private dealsService: DealsService, public formbuilder: FormBuilder, private elRef: ElementRef, private warehouseService: WarehouseService, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  addNewProduct(name) {
    this.warehouseService.createProduct(name).subscribe(product => {
      let fieldProduct = {
        id: product.id,
        name: product.name
      };
      this.product.setValue(fieldProduct);
      let el: HTMLElement = this.notFound.nativeElement as HTMLElement;
      el.innerHTML = "Добавлено";
    });
  }

  ngOnInit() {
    this.serverSideSearchForProducts();

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

  	this.newDealsPositionForm = new FormGroup({
      product: this.product,
      cost: this.cost,
      price: this.price,
      amount: this.amount,
      deadline: this.deadline
    });

    this.currentDate = new Date();
    this.newDealsPositionForm.reset();
  }

}

