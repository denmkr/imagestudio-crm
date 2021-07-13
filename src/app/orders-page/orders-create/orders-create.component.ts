import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, ViewChild, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { OrdersService } from '../orders.service';
import { PartiesService } from '../../parties-page/parties.service';
import { OrdersPositionCreateModalComponent } from './orders-position-create-modal/orders-position-create-modal.component';
import { OrdersPositionEditModalComponent } from '../orders-edit/orders-position-edit-modal/orders-position-edit-modal.component';
import { PartiesAddModalWindowComponent } from '../../parties-page/parties-add-modal-window/parties-add-modal-window.component';
import { DocumentsAddModalWindowComponent } from '../../documents-page/documents-add-modal-window/documents-add-modal-window.component';
import { DatepickerOptions } from 'ng2-datepicker/dist/src/ng-datepicker/component/ng-datepicker.component';
import * as ruLocale from 'date-fns/locale/ru';
declare var require: any;


@Component({
  selector: 'orders-create',
  templateUrl: './orders-create.component.html',
  styleUrls: ['./orders-create.component.css'],
  providers: [OrdersService, PartiesService, DatePipe]
})
export class OrdersCreateComponent implements OnInit {

  title = "Новая сделка";
  cancelLink = "/orders";
  private left_arrow = require("../images/left-arrow.png");

  @HostBinding('class.active')
  yurActive: boolean = false;
  templateActive: boolean = false;

  currentDate: any;

  options: DatepickerOptions = {
    barTitleIfEmpty: 'Выберите месяц и день',
    minYear: 2016,
    placeholder: '01.01.2018',
    displayFormat: 'D.MM.YYYY',
    firstCalendarDay: 1,
    locale: ruLocale,
  };

  partiesLoading: boolean = false;

  @HostBinding('class.active') activeClass: boolean = false;
  @ViewChild(PartiesAddModalWindowComponent) partiesAddModalWindowComponent: PartiesAddModalWindowComponent;
  @ViewChild(DocumentsAddModalWindowComponent) documentsAddModalWindowComponent: DocumentsAddModalWindowComponent;
  @ViewChild(OrdersPositionCreateModalComponent) ordersPositionCreateModalComponent: OrdersPositionCreateModalComponent;
  @ViewChild(OrdersPositionEditModalComponent) ordersPositionEditModalComponent: OrdersPositionEditModalComponent;

  @HostListener('document:keyup', ['$event'])
  handleClick(event: Event) {
    var element =  document.getElementsByClassName('ui-select-choices')[0];
    if (typeof(element) != 'undefined' && element != null) {
      this.activeClass = false;
    }
    else {
      this.activeClass = true;
    }
  }

  public organizations = [];
  public orders_positions = [];
  public documents = [];
  public statuses = [];
  public users = [];
  public counterparties = [];

  public allDocuments = [];

  public selects = [
    {items: "users", name: "user", placeholder: "Менеджер", id: "userSelect", bindLabel: "name", bindValue: "id"}
  ];

  public selectInputs = [
    {name: "counterparty", placeholder: "ИП Пупина Александра Владимировича", title: "Контрагент", items: "counterparties", id: "counterpartiesSelect"}
  ];

  public textAreas = [
    {name: "comment", placeholder: "Комментарий к заказу", big: true}
  ];

  public dateInputs = [
    {name: "deadline", type: "text", placeholder: "10 янв. 2017", title: "Дедлайн", small: true},
  ]

  newOrderForm: FormGroup;

  counterparty: FormControl;
  user: FormControl;
  comment: FormControl;
  deadline: FormControl;

  constructor(private datePipe: DatePipe, private router: Router, public formbuilder: FormBuilder, private ordersService: OrdersService, private partiesService: PartiesService, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  createOrder(event) {

    this.documents = this.documents.map(document => {
      let newDocument = {
        kind: document.kind.id,
        category: document.category.id,
        url: document.url,
        comment: document.comment,
        counterparty: {
          id: document.counterparty.id
        }
      };

      return newDocument;
    });
   
    this.ordersService.createNewOrder(this.newOrderForm.get("deadline").value, this.newOrderForm.get("user").value, this.newOrderForm.get("counterparty").value, this.newOrderForm.get("comment").value, this.orders_positions, this.documents).subscribe(result => {
      this.router.navigate([this.cancelLink]);
      this.newOrderForm.reset();
      this.orders_positions = [];
      this.documents = [];
    });
  }

  public showYurDocuments() {
    if (this.yurActive) {
      this.yurActive = false;
      this.templateActive = false;

      this.documents = this.allDocuments;
    }
    else {
      let newDocuments = [];
      this.allDocuments.map(document => {
        if (document.kind.id != "template") {
          newDocuments.push(document);
        }
      });
      this.documents = newDocuments;
      this.yurActive = true;
      this.templateActive = false;
    }
    
  }

  public showTemplatesDocuments() {
    if (this.templateActive) {
      this.yurActive = false;
      this.templateActive = false;

      this.documents = this.allDocuments;
    }
    else {
      let newDocuments = [];
      this.allDocuments.map(document => {
        if (document.kind.id == "template") {
          newDocuments.push(document);
        }
      });
      this.documents = newDocuments;
      this.yurActive = false;
      this.templateActive = true;
    }
  }

  partiesTypeahead = new EventEmitter<string>();

  private serverSideSearch() {
    this.partiesLoading = true;
    this.partiesTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.partiesService.getPartiesBySearch(term))
    ).subscribe(x => {
        this.cd.markForCheck();
        this.counterparties = x;
        this.partiesLoading = false;
    }, (err) => {
        console.log(err);
        this.counterparties = [];
    });
  }

  updateTable(event) {
    this.allDocuments.push(event);
    this.documents = this.allDocuments;

    this.yurActive = false;
    this.templateActive = false;
  }

  refreshOrderPositions(event) {
    this.orders_positions.push(event);
  }

  addNewDocument() {
    this.documentsAddModalWindowComponent.showForOrder();
  }

  addNewParty(name) {
    this.partiesAddModalWindowComponent.showWithName(name);
  }

  editPosition(position) {
    this.ordersPositionEditModalComponent.showWithUnsavedData(position);
  }

  ngOnInit() {
    this.serverSideSearch();

    this.ordersService.getManagers().subscribe(
      result => { 
        this.users = result;
      }
    );

    this.counterparty = new FormControl('', [
      Validators.required
    ]);
    this.user = new FormControl('', [
      Validators.required
    ]);
    this.deadline = new FormControl('', [
      Validators.required
    ]);
    this.comment = new FormControl('', [
      Validators.required
    ]);

  	this.newOrderForm = new FormGroup({
      user: this.user,
      comment: this.comment,
      deadline: this.deadline,
      counterparty: this.counterparty
    });

    this.currentDate = new Date();
    this.newOrderForm.reset();
  }

  addNewOrdersPosition() {
    this.ordersPositionCreateModalComponent.show();
  }

}
