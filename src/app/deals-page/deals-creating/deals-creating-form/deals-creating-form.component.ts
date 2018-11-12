import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, ViewChild, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { DealsService } from '../../deals.service';
import { PartiesService } from '../../../parties-page/parties.service';
import { DealsPositionsAddModalWindowComponent } from './deals-positions-add-modal-window/deals-positions-add-modal-window.component';
import { PartiesAddModalWindowComponent } from '../../../parties-page/parties-add-modal-window/parties-add-modal-window.component';
import { DocumentsAddModalWindowComponent } from '../../../documents-page/documents-add-modal-window/documents-add-modal-window.component';
import { DatepickerOptions } from 'ng2-datepicker/dist/src/ng-datepicker/component/ng-datepicker.component';
import * as ruLocale from 'date-fns/locale/ru';


@Component({
  selector: 'deals-creating-form',
  templateUrl: './deals-creating-form.component.html',
  styleUrls: ['./deals-creating-form.component.css'],
  providers: [DealsService, PartiesService]
})
export class DealsCreatingFormComponent implements OnInit {

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
  comment: FormControl;
  deadline: FormControl;

  public counterparties = [];

  constructor(private router: Router, public formbuilder: FormBuilder, private dealsService: DealsService, private partiesService: PartiesService, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  createDeal(event) {
    this.dealsService.createNewDeal(this.newDealForm.get("deadline").value, this.newDealForm.get("user").value, this.newDealForm.get("counterparty").value, this.newDealForm.get("comment").value, this.orders_positions);
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
    console.log(event);
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
    this.deadline = new FormControl('', [
      Validators.required
    ]);
    this.comment = new FormControl('', [
      Validators.required
    ]);

  	this.newDealForm = new FormGroup({
      user: this.user,
      comment: this.comment,
      deadline: this.deadline,
      counterparty: this.counterparty
    });

    this.newDealForm.reset();
  }

  addNewDealsPosition() {
    this.dealsPositionsAddModalWindowComponent.show();
  }

}
