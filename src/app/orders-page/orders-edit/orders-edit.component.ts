import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, ViewChild, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { OrdersService } from '../orders.service';
import { PartiesService } from '../../parties-page/parties.service';
import { OrdersPositionEditModalComponent } from './orders-position-edit-modal/orders-position-edit-modal.component';
import { OrdersPositionCreateModalComponent } from '../orders-create/orders-position-create-modal/orders-position-create-modal.component';
import { PartiesAddModalWindowComponent } from '../../parties-page/parties-add-modal-window/parties-add-modal-window.component';
import { DocumentsEditModalWindowComponent } from '../../documents-page/documents-edit-modal-window/documents-edit-modal-window.component';
import { DocumentsAddModalWindowComponent } from '../../documents-page/documents-add-modal-window/documents-add-modal-window.component';
import { DatepickerOptions } from 'ng2-datepicker/dist/src/ng-datepicker/component/ng-datepicker.component';
import * as ruLocale from 'date-fns/locale/ru';

declare var require: any;


@Component({
  selector: 'orders-edit',
  templateUrl: './orders-edit.component.html',
  styleUrls: ['./orders-edit.component.css'],
  providers: [OrdersService, PartiesService]
})
export class OrdersEditComponent implements OnInit {

  title = "Редактирование сделки";
  cancelLink = "/orders";
  private left_arrow = require("../images/left-arrow.png");

  @HostBinding('class.active')
  yurActive: boolean = false;
  templateActive: boolean = false;

  partiesLoading: boolean = false;
  currentDate: any;

  options: DatepickerOptions = {
    barTitleIfEmpty: 'Выберите дату',
    minYear: 2016,
    placeholder: '01.01.2018',
    displayFormat: 'D.MM.YYYY',
    firstCalendarDay: 1,
    locale: ruLocale,
  };

  @HostBinding('class.active') activeClass: boolean = false;
  @ViewChild(PartiesAddModalWindowComponent) partiesAddModalWindowComponent: PartiesAddModalWindowComponent;
  @ViewChild(DocumentsEditModalWindowComponent) documentsEditModalWindowComponent: DocumentsEditModalWindowComponent;
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

  public organizations;
  public orders_positions = [];
  public documents = [];
  public allDocuments = [];

  public selects = [
    {items: "users", name: "doer", placeholder: "Менеджер", id: "userSelect", bindLabel: "name", bindValue: "id"},
    {items: "statuses", name: "status", placeholder: "Статус", id: "statusSelect", bindLabel: "name", bindValue: "id"}
  ];

  public selectInputs = [
    {name: "counterparty", placeholder: "ИП Пупина Александра Владимировича", title: "Контрагент", items: "counterparties", id: "counterpartiesSelect"}
  ];

  public textAreas = [
    {name: "comment", placeholder: "Комментарий к заказу", big: true}
  ];

  public dateInputs = [
    {name: "must_be_finished_at", type: "text", placeholder: "10 янв. 2017", title: "Дедлайн", small: true},
  ]

  public statuses = [];
  public users = [];
  oldStatusId: string;

  editOrderForm: FormGroup;

  id: string;
  counterparty: FormControl;
  doer: FormControl;
  status: FormControl;
  comment: FormControl;
  must_be_finished_at: FormControl;

  public counterparties = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, public formbuilder: FormBuilder, private ordersService: OrdersService, private partiesService: PartiesService, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  editOrder(event) {
    if (this.oldStatusId != this.status.value) {
      this.ordersService.updateOrderStatusByOrderId(this.status.value, this.id);
    }

    this.ordersService.editOrderById(this.id, this.editOrderForm.get("must_be_finished_at").value, this.editOrderForm.get("doer").value, this.editOrderForm.get("counterparty").value, this.editOrderForm.get("comment").value, this.orders_positions, this.documents);
    this.editOrderForm.reset();
    this.router.navigate([this.cancelLink]);
  }

  remove() {
    this.ordersService.removeOrderById(this.id).subscribe(result => {
      this.router.navigate([this.cancelLink]);
    });
  }

  editDocument(document) {
    this.documentsEditModalWindowComponent.showForOrder(document);
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

  updateTableEdit(event) {
    this.ordersService.getOrderById(this.id).subscribe(order => {
      this.documents = order.documents;
      this.orders_positions = order.orders_positions;
    });
  }

  refreshOrderPositions(event) {
    this.orders_positions.push(event);
  }

  editOrderPosition(event) {
  	//this.orders_positions = [];
  	this.orders_positions.push(event);
  }

  refreshOrderPositionsEdit(event) {
    this.ordersService.getOrderById(this.id).subscribe(order => {
      this.orders_positions = order.orders_positions;
    });
  }

  addNewDocument() {
    this.documentsAddModalWindowComponent.showForOrder();
  }

  addNewParty(name) {
    this.partiesAddModalWindowComponent.showWithName(name);
  }

  editPosition(position) {
    this.ordersPositionEditModalComponent.showWithData(position);
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
    this.doer = new FormControl('', [
      Validators.required
    ]);
    this.status = new FormControl('', [
      Validators.required
    ]);
    this.must_be_finished_at = new FormControl('', [
      Validators.required
    ]);
    this.comment = new FormControl('', [
      Validators.required
    ]);

    this.editOrderForm = new FormGroup({
      doer: this.doer,
      status: this.status,
      comment: this.comment,
      must_be_finished_at: this.must_be_finished_at,
      counterparty: this.counterparty
    });

    this.currentDate = Date.now();
    this.editOrderForm.reset();

    this.activatedRoute.queryParams.subscribe(params => {
      this.ordersService.getOrderById(params['id']).subscribe(order => {
        this.id = params['id'];
        this.counterparty.setValue(order.counterparty.id);
        this.doer.setValue(order.doer.id);
        this.comment.setValue(order.comment);
        this.must_be_finished_at.setValue(order.must_be_finished_at);
        this.status.setValue(order.status.id);
        this.oldStatusId = order.status.id;

        this.statuses = order.available_events;
        this.documents = order.documents;
        this.allDocuments = this.documents;

        this.orders_positions = order.orders_positions;

      });

    });

    this.getCurrentParty();
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

  getCurrentParty() {
    this.partiesService.getPartiesBySearch(this.counterparty.value).subscribe(counterparties => { this.counterparties = counterparties });
  }

  addNewOrdersPosition() {
    this.ordersPositionCreateModalComponent.show();
  }

}
