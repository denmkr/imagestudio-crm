import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, ViewChild, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { DesignService } from '../../design.service';
import { PartiesService } from '../../../parties-page/parties.service';
import { DesignPositionsAddModalWindowComponent } from './design-positions-add-modal-window/design-positions-add-modal-window.component';
import { PartiesAddModalWindowComponent } from '../../../parties-page/parties-add-modal-window/parties-add-modal-window.component';

@Component({
  selector: 'design-creating-form',
  templateUrl: './design-creating-form.component.html',
  styleUrls: ['./design-creating-form.component.css'],
  providers: [DesignService, PartiesService]
})
export class DesignCreatingFormComponent implements OnInit {

  @HostBinding('class.active') activeClass: boolean = false;
  @ViewChild(PartiesAddModalWindowComponent) partiesAddModalWindowComponent: PartiesAddModalWindowComponent;
  @ViewChild(DesignPositionsAddModalWindowComponent) designPositionsAddModalWindowComponent: DesignPositionsAddModalWindowComponent;

  cancelLink = "/design";

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

  public selects = [
    {items: "statuses", name: "status", placeholder: "Статус", id: "statusSelect"},
    {items: "users", name: "user", placeholder: "Менеджер", id: "userSelect"},
  ];

  public selectInputs = [
    {name: "counterparty", placeholder: "ИП Пупина Александра Владимировича", title: "Контрагент", items: "counterparties", id: "counterpartiesSelect"}
  ];

  public textAreas = [
    {name: "comment", placeholder: "Комментарий к заказу", big: true}
  ];

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

  status: FormControl;
  counterparty: FormControl;
  user: FormControl;
  comment: FormControl;

  public counterparties = [];

  constructor(public formbuilder: FormBuilder, private designService: DesignService, private partiesService: PartiesService, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  createDeal(event) {
    if (this.newDealForm.controls.email.valid) {
      this.newDealForm.controls.organization;
  	  this.designService.createNewDeal(this.newDealForm.get("type").value, this.newDealForm.get("category").value, this.newDealForm.get("counterparty").value, this.newDealForm.get("comment").value);
      
      this.newDealForm.reset();
    }
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

  addNewParty(name) {
    this.partiesAddModalWindowComponent.showWithName(name);
  }

  ngOnInit() {
    this.serverSideSearch();

    this.status = new FormControl('', [
      Validators.required
    ]);
    this.counterparty = new FormControl('', [
      Validators.required
    ]);
    this.user = new FormControl('', [
      Validators.required
    ]);
    this.comment = new FormControl('', [
      Validators.required
    ]);

  	this.newDealForm = new FormGroup({
      status: this.status,
      user: this.user,
      comment: this.comment,
      counterparty: this.counterparty
    });

    this.newDealForm.reset();
  }

  addNewDealsPosition() {
    this.designPositionsAddModalWindowComponent.show();
  }

}
