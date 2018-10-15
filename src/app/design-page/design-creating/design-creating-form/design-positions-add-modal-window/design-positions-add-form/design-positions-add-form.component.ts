import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { DesignItemsAddModalWindowComponent } from './design-items-add-modal-window/design-items-add-modal-window.component';

@Component({
  selector: 'design-positions-add-form',
  templateUrl: './design-positions-add-form.component.html',
  styleUrls: ['./design-positions-add-form.component.css']
})
export class DesignPositionsAddFormComponent implements OnInit {

  @ViewChild(DesignItemsAddModalWindowComponent) designItemsAddModalWindowComponent: DesignItemsAddModalWindowComponent;
  @HostBinding('class.active') activeClass: boolean = false;
  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;
  bigWindow = true;

  orders_items = [];

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

  public inputs = [
    {name: "name", type: "text", inline: true, placeholder: "Толстовка с вышивкой", title: "Название"},
    {name: "cost", type: "text", inline: true, title: "Себес.", tiny: true, smallTitle: true},
    {name: "price", type: "text", inline: true, title: "Продаж.", tiny: true, smallTitle: true},
    {name: "amount", type: "text", title: "Количество", tiny: true},
    {name: "deadline", type: "text", placeholder: "10 янв. 2017", title: "Дедлайн", small: true},
  ];

  newDealsPositionForm: FormGroup;

  status: FormControl;
  name: FormControl;
  cost: FormControl;
  price: FormControl;
  amount: FormControl;
  deadline: FormControl;

  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  addNewDealsItem() {
    this.designItemsAddModalWindowComponent.show();
  }

  addDealsPositions() {
  	console.log("ADD");
  }

  constructor(public formbuilder: FormBuilder, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  ngOnInit() {

    this.status = new FormControl('', [
      Validators.required
    ]);
    this.name = new FormControl('', [
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
      name: this.name,
      cost: this.cost,
      price: this.price,
      amount: this.amount,
      deadline: this.deadline
    });

    this.newDealsPositionForm.reset();
  }

}

