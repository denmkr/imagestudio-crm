import { Component, OnInit, EventEmitter, Output, ElementRef, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { DealsService } from '../../deals.service';

@Component({
  selector: 'deals-creating-form',
  templateUrl: './deals-creating-form.component.html',
  styleUrls: ['./deals-creating-form.component.css'],
  providers: [DealsService]
})
export class DealsCreatingFormComponent implements OnInit {

  @HostBinding('class.active') activeClass: boolean = false;

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
    {items: "status", name: "status", placeholder: "Статус", id: "statusSelect"},
    
  ];

  public selectInputs = [
    {items: "users", name: "user", placeholder: "Ответственный", id: "userSelect"}
  ];

  public inputs = [
    {name: "comment", type: "text", placeholder: "Комментарий", big: true}
  ];

  public types = [
    {text: 'Партнер', id: 'partner'}, 
    {text: 'Клиент', id: 'client'}
  ];

  public categories = [
    {text: 'Государство', id: "state"}, 
    {text: 'Бизнес', id: "business"},
    {text: 'Частное лицо', id: "individual"}
  ];

  newDealForm: FormGroup;

  type: FormControl;
  category: FormControl;
  counterparty: FormControl;
  comment: FormControl;

  constructor(public formbuilder: FormBuilder, private dealsService: DealsService, private elRef: ElementRef, private renderer: Renderer) { }

  createDeal(event) {
    if (this.newDealForm.controls.email.valid) {
      this.newDealForm.controls.organization;
  	  this.dealsService.createNewDeal(this.newDealForm.get("type").value, this.newDealForm.get("category").value, this.newDealForm.get("counterparty").value, this.newDealForm.get("comment").value);
      
      this.newDealForm.reset();
    }
  }

  createOrganization() {
    // this.partiesService.createOrganization();
  }

  getAllOrganizations() {
    this.dealsService.getOrganizations().subscribe(organizations => { this.organizations = organizations });
  }

  ngOnInit() {
 
    this.getAllOrganizations();

    this.category = new FormControl('', [
      Validators.required
    ]);
    this.counterparty = new FormControl('', [
      Validators.required
    ]);
    this.comment = new FormControl('', [
      Validators.required
    ]);
    this.type = new FormControl('', [
      Validators.required
    ]);

  	this.newDealForm = new FormGroup({
      type: this.type,
      category: this.category,
      counterparty: this.counterparty,
      comment: this.comment,
    });
  }

}
