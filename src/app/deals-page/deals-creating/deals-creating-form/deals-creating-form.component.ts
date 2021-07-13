import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, ViewChild, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
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
  providers: [DealsService, PartiesService, DatePipe]
})
export class DealsCreatingFormComponent implements OnInit {

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

  newDealForm: FormGroup;

  counterparty: FormControl;
  user: FormControl;
  comment: FormControl;
  deadline: FormControl;

  constructor(private datePipe: DatePipe, private router: Router, public formbuilder: FormBuilder, private dealsService: DealsService, private partiesService: PartiesService, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  createDeal(event) {

    this.documents = this.documents.map(document => {
      let newDocument = {
        number: document.number,
        kind: document.kind.id,
        category: document.category.id,
        url: document.url,
        comment: document.comment,
        organization: document.organization,
        counterparty: {
          id: this.counterparty.value
        }
        
      };

      return newDocument;
    });
    
    this.dealsService.createNewDeal(this.newDealForm.get("deadline").value, this.newDealForm.get("user").value, this.newDealForm.get("counterparty").value, this.newDealForm.get("comment").value, this.orders_positions, this.documents).subscribe(result => {
      this.router.navigate([this.cancelLink]);
      this.newDealForm.reset();
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
    let documents = [];
    event.orders_items.map(item => {
      item.documents.map(document => {
        this.allDocuments.push(document);
      });
    });

    this.documents = this.allDocuments;
    this.orders_positions.push(event);
  }

  addNewDocument() {
    this.documentsAddModalWindowComponent.showForOrder();
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

    this.currentDate = new Date();
    this.newDealForm.reset();
  }

  addNewDealsPosition() {
    this.dealsPositionsAddModalWindowComponent.show();
  }

}
