import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { PartiesService } from '../../parties.service';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'

@Component({
  selector: 'parties-add-form',
  templateUrl: './parties-add-form.component.html',
  styleUrls: ['./parties-add-form.component.css'],
  providers: [PartiesService]
})
export class PartiesAddFormComponent implements OnInit {

  @HostBinding('class.active') activeClass: boolean = false;
  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;

  /*
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
  */

  public selects = [
    {items: "types", name: "type", placeholder: "Тип", id: "typeSelect"},
    {items: "categories", name: "category", placeholder: "Категория", id: "categorySelect"}
  ];

  public organizations = [];

  public selectInputs = [
    {name: "organization", placeholder: "ИП Пупина Александра Владимировича", title: "Организация", items: "organizations", id: "organizationSelect"}
  ];

  public inputs = [
    {name: "email", type: "email", placeholder: "pupinastar@imagestudio.su", title: "Email"},
    {name: "contact", type: "text", placeholder: "Фамилия Имя Отчество", inline: true, title: "Контакт"},
    {name: "position", type: "text", placeholder: "Должность", inline: true, small: true},
    {name: "phone", type: "text", placeholder: "+7 (903) 344-56-22", title: "Телефон"},
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

  newPartyForm: FormGroup;

  type: FormControl;
  category: FormControl;
  organization: FormControl;
  email: FormControl;
  contact: FormControl;
  position: FormControl;
  phone: FormControl;
  comment: FormControl;

  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  constructor(public formbuilder: FormBuilder, private partiesService: PartiesService, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  setName(name) {
    this.newPartyForm.get("contact").setValue(name);
  }

  createParty(event) {
    if (this.newPartyForm.valid) {
      let organization_id = this.newPartyForm.get("organization").value;
      
      if (isNaN(this.organization.value)) {
        this.partiesService.createOrganization(this.organization.value).subscribe(result => {
          organization_id = result.organization.id;

          this.partiesService.createNewParty(this.newPartyForm.get("type").value, this.newPartyForm.get("category").value, 
          organization_id, this.newPartyForm.get("email").value, this.newPartyForm.get("contact").value,
          this.newPartyForm.get("position").value, this.newPartyForm.get("phone").value, this.newPartyForm.get("comment").value).subscribe(
            res => { 
              this.newPartyForm.reset();
              this.refreshTableEvent.emit(true);
              this.eventEmitter.emit(true);
            },
            err => { console.log(err) }
          );
        }, err => { console.log(err); });
      }
      else {
        this.partiesService.createNewParty(this.newPartyForm.get("type").value, this.newPartyForm.get("category").value, 
        organization_id, this.newPartyForm.get("email").value, this.newPartyForm.get("contact").value,
        this.newPartyForm.get("position").value, this.newPartyForm.get("phone").value, this.newPartyForm.get("comment").value).subscribe(
          res => { 
            this.newPartyForm.reset();
            this.refreshTableEvent.emit(true);
            this.eventEmitter.emit(true);
          },
          err => { console.log(err) }
        );
      }
    }
    else {
      this.validationClass = true;
    }
  }

  organizationsTypeahead = new EventEmitter<string>();

  private serverSideSearch() {
    this.organizationsTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.partiesService.getOrganizations(term))
    ).subscribe(x => {
        this.cd.markForCheck();
        this.organizations = x;
    }, (err) => {
        console.log(err);
        this.organizations = [];
    });
  }

  ngOnInit() {

    //this.partiesService.getOrganizations("auth").subscribe(organizations => { this.organizations = organizations; });
    this.serverSideSearch();

  	this.email = new FormControl("", [
  	  Validators.required, 
  	  Validators.pattern("[^ @]*@[^ @]*")
  	]);
    this.category = new FormControl('', [
      Validators.required
    ]);
    this.organization = new FormControl('', [
      Validators.required
    ]);
    this.contact = new FormControl('', [
      Validators.required
    ]);
    this.position = new FormControl('', [
      Validators.required
    ]);
    this.phone = new FormControl('', [
      Validators.required,
      Validators.pattern("[ -()+0-9]*")
    ]);
    this.comment = new FormControl('', [
      Validators.required
    ]);
    this.type = new FormControl('', [
      Validators.required
    ]);

  	this.newPartyForm = new FormGroup({
      type: this.type,
      category: this.category,
      organization: this.organization,
      email: this.email,
      contact: this.contact,
      position: this.position,
      phone: this.phone,
      comment: this.comment,
    });

    this.newPartyForm.reset();
  }

  addTag(name) {
    return { id: name, text: name };
  }

  onChange(change) {
    // console.log(this.type.value);
  }

}
