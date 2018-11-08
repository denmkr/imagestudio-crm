import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { DealsItemsEditModalWindowComponent } from './deals-items-edit-modal-window/deals-items-edit-modal-window.component';
import { WarehouseService } from '../../../../../warehouse-page/warehouse.service';

@Component({
  selector: 'deals-positions-edit-form',
  templateUrl: './deals-positions-edit-form.component.html',
  styleUrls: ['./deals-positions-edit-form.component.css'],
  providers: [ WarehouseService ]
})
export class DealsPositionsEditFormComponent implements OnInit {

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

  public statuses = [
    {text: 'Новое', id: 'new'}, 
    {text: 'Лид', id: 'lead'},
    {text: 'В работе', id: 'work'},
    {text: 'Долг', id: 'debt'},
    {text: 'Сделано', id: 'done'},
    {text: 'Слив', id: 'dumb'}
  ];

  public position_items = [];

  public inputs = [
    {name: "amount", type: "text", inline: true, title: "Количество", tiny: true},
    {name: "cost", type: "text", inline: true, title: "Себес.", tiny: true, smallTitle: true},
    {name: "price", type: "text", inline: true, title: "Продаж.", tiny: true, smallTitle: true},
    {name: "deadline", type: "text", placeholder: "10 янв. 2017", title: "Дедлайн", small: true},
  ];

  newDealsPositionForm: FormGroup;

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

  addDealsPositions() {
    let order_position = this.newDealsPositionForm.value;
    order_position.items = this.position_items;
    
    this.refreshOrderPositions.emit(order_position);
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

  constructor(public formbuilder: FormBuilder, private elRef: ElementRef, private warehouseService: WarehouseService, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  addTag(name) {
    return { id: name, text: name };
  }

  ngOnInit() {
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

  	this.newDealsPositionForm = new FormGroup({
      status: this.status,
      product: this.product,
      cost: this.cost,
      price: this.price,
      amount: this.amount,
      deadline: this.deadline
    });

    this.newDealsPositionForm.reset();
  }

}

