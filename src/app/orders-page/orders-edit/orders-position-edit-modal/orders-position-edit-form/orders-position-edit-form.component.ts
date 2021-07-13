import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { OrdersItemEditModalComponent } from '../../orders-item-edit-modal/orders-item-edit-modal.component';
import { OrdersItemCreateModalComponent } from '../../../orders-create/orders-item-create-modal/orders-item-create-modal.component';
import { WarehouseService } from '../../../../warehouse-page/warehouse.service';
import { OrdersService } from '../../../orders.service';
import { DatepickerOptions } from 'ng2-datepicker/dist/src/ng-datepicker/component/ng-datepicker.component';
import * as ruLocale from 'date-fns/locale/ru';

@Component({
  selector: 'orders-position-edit-form',
  templateUrl: './orders-position-edit-form.component.html',
  styleUrls: ['./orders-position-edit-form.component.css'],
  providers: [ WarehouseService, OrdersService ]
})
export class OrdersPositionEditFormComponent implements OnInit {

  options: DatepickerOptions = {
    barTitleIfEmpty: 'Выберите месяц и день',
    minYear: 2016,
    placeholder: '01.01.2018',
    displayFormat: 'D.MM.YYYY',
    firstCalendarDay: 1,
    locale: ruLocale,
  };

  @ViewChild(OrdersItemEditModalComponent) ordersItemEditModalComponent: OrdersItemEditModalComponent;
  @ViewChild(OrdersItemCreateModalComponent) ordersItemCreateModalComponent: OrdersItemCreateModalComponent;

  @HostBinding('class.active') activeClass: boolean = false;
  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;
  bigWindow = true;

  public products = [];
  public saved = false;

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
  ]

  editOrdersPositionForm: FormGroup;

  id: number;
  orderId: number;
  status: FormControl;
  product: FormControl;
  cost: FormControl;
  price: FormControl;
  amount: FormControl;
  deadline: FormControl;

  @Output() refreshOrderPositions = new EventEmitter<any>();
  @Output() editOrderPosition = new EventEmitter<any>();
  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  remove() {
    this.ordersService.removePositionById(this.id).subscribe(result => {
      let order_position = this.editOrdersPositionForm.value;
      this.refreshOrderPositions.emit(order_position);
    });
  }

  addNewOrdersItem() {
    this.ordersItemCreateModalComponent.showForPosition(this.id);
  }

  editOrdersItem(item) {
    this.ordersItemEditModalComponent.showWithData(item, this.id);
  }

  addPositionItems(event) {
    this.refreshItems();
    // this.position_items.push(event);
  }

  refreshItems() {
    this.ordersService.getPositionById(this.id.toString()).subscribe(result => {
      this.position_items = result.orders_position.orders_items;
      this.cost.setValue(result.orders_position.prime_price);
    });
  }

  editOrdersPosition() {
  	if (this.editOrdersPositionForm.valid) {
  		if (this.saved) {
	  		let order_position = this.editOrdersPositionForm.value;
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
		    
		    this.ordersService.editPositionById(this.id, positionForm.must_be_finished_at, positionForm.product.id, positionForm.orderId, positionForm.price, positionForm.count).subscribe(result => {
		      this.refreshOrderPositions.emit(order_position);
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
      
      		this.editOrderPosition.emit(positionForm);
	  	}
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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, public formbuilder: FormBuilder, private elRef: ElementRef, private warehouseService: WarehouseService, private ordersService: OrdersService, private renderer: Renderer, private cd: ChangeDetectorRef) { }

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
    this.position_items = position.orders_items;
    this.id = position.id;
    this.product.setValue(position.product);
    this.status.setValue(position.status.id);
    this.statuses = position.available_events;
    this.cost.setValue(position.prime_price);
    this.price.setValue(position.price);
    this.deadline.setValue(position.must_be_finished_at);
    this.amount.setValue(position.count);

    this.saved = true;
  }

  updateUnsavedData(position) {
    let first_price: number = 0;
    this.position_items.map(position_item => {
      first_price += parseInt(position_item.prime_price);
    });
    this.cost.setValue(first_price);

  	this.position_items = position.orders_items;
    this.product.setValue(position.product);
    this.status.setValue("new");
    this.statuses = [{id: 'new', name: 'Новое'}];
    this.price.setValue(position.price);
    this.deadline.setValue(position.must_be_finished_at);
    this.amount.setValue(position.count);
  }

  changeItemStatus(id, event) {
    this.ordersService.updateItemStatusById(event.id, id).subscribe(
      result => {
        console.log(result);
        // this.itemStatusForm.reset();
        // this.showAllOrders();
      }
    );
  }

  changePositionStatus(event) {
    this.ordersService.updatePositionStatusByOrderId(event.id, this.id.toString()).subscribe(
      result => {
        console.log(result);
        // this.itemStatusForm.reset();
        // this.showAllOrders();
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
    ]);
    this.price = new FormControl('', [
      Validators.required
    ]);
    this.amount = new FormControl('', [
      Validators.required
    ]);
    this.deadline = new FormControl('', [
    ]);

    this.editOrdersPositionForm = new FormGroup({
      status: this.status,
      product: this.product,
      cost: this.cost,
      price: this.price,
      amount: this.amount,
      deadline: this.deadline
    });

    this.editOrdersPositionForm.reset();
  }

}

