import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { OrdersItemCreateModalComponent } from '../../orders-item-create-modal/orders-item-create-modal.component';
import { WarehouseService } from '../../../../warehouse-page/warehouse.service';
import { OrdersService } from '../../../orders.service';
import { DatepickerOptions } from 'ng2-datepicker/dist/src/ng-datepicker/component/ng-datepicker.component';
import * as ruLocale from 'date-fns/locale/ru';

@Component({
  selector: 'orders-position-create-form',
  templateUrl: './orders-position-create-form.component.html',
  styleUrls: ['./orders-position-create-form.component.css'],
  providers: [ WarehouseService, OrdersService ]
})
export class OrdersPositionCreateFormComponent implements OnInit {

  options: DatepickerOptions = {
    barTitleIfEmpty: 'Выберите месяц и день',
    minYear: 2016,
    placeholder: '01.01.2018',
    displayFormat: 'D.MM.YYYY',
    firstCalendarDay: 1,
    locale: ruLocale,
  };

  currentDate: any;

  @ViewChild(OrdersItemCreateModalComponent) ordersItemCreateModalComponent: OrdersItemCreateModalComponent;
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

  newOrdersPositionForm: FormGroup;

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

  addNewOrdersItem() {
    this.ordersItemCreateModalComponent.show();
  }

  addPositionItems(event) {
    this.position_items.push(event);

    let first_price: number = 0;
    this.position_items.map(position_item => {
      first_price += parseInt(position_item.prime_price);
    });
    this.cost.setValue(first_price);
  }

  addOrdersPositions() {

    if (this.newOrdersPositionForm.valid) {
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

  constructor(private ordersService: OrdersService, public formbuilder: FormBuilder, private elRef: ElementRef, private warehouseService: WarehouseService, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  addNewProduct(name) {
    this.warehouseService.createProduct(name).subscribe(product => {
      let fieldProduct = {
        id: product.id,
        name: product.name
      };
      this.product.setValue(fieldProduct);
    });
  }

  ngOnInit() {

    this.serverSideSearchForProducts();

    this.product = new FormControl('', [
      Validators.required
    ]);
    this.cost = new FormControl('', [
    ]);
    this.price = new FormControl('', [
      Validators.required
    ]);
    this.amount = new FormControl('', [
      Validators.required
    ]);
    this.deadline = new FormControl('', [
    ]);

  	this.newOrdersPositionForm = new FormGroup({
      product: this.product,
      cost: this.cost,
      price: this.price,
      amount: this.amount,
      deadline: this.deadline
    });

    this.currentDate = new Date();
    this.newOrdersPositionForm.reset();
  }

}

