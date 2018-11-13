import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, ViewChild, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { DealsService } from '../../deals.service';
import { PartiesService } from '../../../parties-page/parties.service';
import { DealsPositionsEditModalWindowComponent } from './deals-positions-edit-modal-window/deals-positions-edit-modal-window.component';
import { DealsPositionsAddModalWindowComponent } from '../../deals-creating/deals-creating-form/deals-positions-add-modal-window/deals-positions-add-modal-window.component';
import { PartiesAddModalWindowComponent } from '../../../parties-page/parties-add-modal-window/parties-add-modal-window.component';
import { DocumentsAddModalWindowComponent } from '../../../documents-page/documents-add-modal-window/documents-add-modal-window.component';
import { DatepickerOptions } from 'ng2-datepicker/dist/src/ng-datepicker/component/ng-datepicker.component';
import * as ruLocale from 'date-fns/locale/ru';


@Component({
  selector: 'deals-editing-form',
  templateUrl: './deals-editing-form.component.html',
  styleUrls: ['./deals-editing-form.component.css'],
  providers: [DealsService, PartiesService]
})
export class DealsEditingFormComponent implements OnInit {

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
  @ViewChild(DocumentsAddModalWindowComponent) documentsAddModalWindowComponent: DocumentsAddModalWindowComponent;
  @ViewChild(DealsPositionsAddModalWindowComponent) dealsPositionsAddModalWindowComponent: DealsPositionsAddModalWindowComponent;
  @ViewChild(DealsPositionsEditModalWindowComponent) dealsPositionsEditModalWindowComponent: DealsPositionsEditModalWindowComponent;

  cancelLink = "/deals";

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

  public selects = [
    {items: "users", name: "user", placeholder: "Менеджер", id: "userSelect", bindLabel: "name", bindValue: "id"},
    {items: "statuses", name: "status", placeholder: "Статус", id: "statusSelect", bindLabel: "text", bindValue: "id"}
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

  public statuses = [
    {text: 'Новое', id: 'new'}, 
    {text: 'Лид', id: 'lead'},
    {text: 'В работе', id: 'work'},
    {text: 'Долг', id: 'debt'},
    {text: 'Сделано', id: 'done'},
    {text: 'Слив', id: 'dumb'}
  ];

  public users = [
    {text: 'Ильдан', id: "1"}, 
    {text: 'Максим', id: "2"},
    {text: 'Андрей', id: "3"}
  ];

  newDealForm: FormGroup;

  counterparty: FormControl;
  user: FormControl;
  status: FormControl;
  comment: FormControl;
  deadline: FormControl;

  public counterparties = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, public formbuilder: FormBuilder, private dealsService: DealsService, private partiesService: PartiesService, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  createDeal(event) {
    this.documents = this.documents.map(document => {
      let newDocument = {
        number: document.orderNumber,
        kind: document.type.id,
        category: document.category.id,
        url: document.url,
        comment: document.comment,
        counterparty: {
          id: document.counterparty
        }
      };

      return newDocument;
    });

    this.dealsService.createNewDeal(this.newDealForm.get("deadline").value, this.newDealForm.get("user").value, this.newDealForm.get("counterparty").value, this.newDealForm.get("comment").value, this.orders_positions, this.documents);
    this.newDealForm.reset();
    this.router.navigate([this.cancelLink]);
  }

  partiesTypeahead = new EventEmitter<string>();

  private serverSideSearch() {
    this.partiesTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.partiesService.getPartiesBySearch(term))
    ).subscribe(x => {
        this.cd.markForCheck();
        this.counterparties = x;
    }, (err) => {
        console.log(err);
        
        this.counterparties = [];
    });
  }

  updateTable(event) {
    this.documents.push(event);
  }

  refreshOrderPositions(event) {
    this.orders_positions.push(event);
  }

  addNewDocument() {
    this.documentsAddModalWindowComponent.show();
  }

  addNewParty(name) {
    this.partiesAddModalWindowComponent.showWithName(name);
  }

  ngOnInit() {
    this.serverSideSearch();

    this.dealsService.getManagers().subscribe(
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
    this.status = new FormControl('', [
      Validators.required
    ]);
    this.deadline = new FormControl('', [
      Validators.required
    ]);
    this.comment = new FormControl('', [
      Validators.required
    ]);

    this.newDealForm = new FormGroup({
      user: this.user,
      status: this.status,
      comment: this.comment,
      deadline: this.deadline,
      counterparty: this.counterparty
    });

    this.newDealForm.reset();

    this.activatedRoute.queryParams.subscribe(params => {
      this.dealsService.getDealById(params['id']).subscribe(result => {
        console.log(result);
        this.counterparty.setValue(result.order.counterparty.id);
        this.user.setValue(result.order.doer.id);
        this.comment.setValue(result.order.comment);
        this.deadline.setValue(result.order.must_be_finished_at);
        this.status.setValue(result.order.status);

        result.order.documents.map(document => {
          document.orderNumber = document.number;
          document.category = {
            text: document.category
          };
          document.type = {
            text: document.kind
          };
          document.comment = document.comment;
          document.url = document.url;
        });

        result.order.orders_positions.map(orders_position => {
          orders_position.product = {
            text: orders_position.product.name,
            id: orders_position.product.id,
          };
          orders_position.first_price = orders_position.prime_price;
        });

        this.documents = result.order.documents;
        this.orders_positions = result.order.orders_positions;
      });
      
    });

    this.getCurrentParty();

  }

  getCurrentParty() {
    this.partiesService.getPartiesBySearch(this.counterparty.value).subscribe(counterparties => { this.counterparties = counterparties });
  }

  addNewDealsPosition() {
    this.dealsPositionsAddModalWindowComponent.show();
  }

}
