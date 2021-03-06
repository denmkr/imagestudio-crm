import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, ChangeDetectorRef, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { PartiesService } from '../../parties.service';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'

@Component({
  selector: 'parties-edit-form',
  templateUrl: './parties-edit-form.component.html',
  styleUrls: ['./parties-edit-form.component.css'],
  providers: [PartiesService]
})
export class PartiesEditFormComponent implements OnInit {

  @HostBinding('class.validation') validationClass: boolean = false;

  public party;

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

  editPartyForm: FormGroup;

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

  removeParty() {
    if (confirm("Удалить данного контрагента?")) {
      this.partiesService.removeParty(this.party.id).subscribe(
        res => { 
          this.eventEmitter.emit(true);
          this.refreshTableEvent.emit(true);
        },
        err => { console.log(err) }
      ); 
    }
  }

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  constructor(public formbuilder: FormBuilder, private partiesService: PartiesService, private cd: ChangeDetectorRef) { }

  getCurrentOrganization() {
    this.partiesService.getOrganizations(this.party.organization).subscribe(organizations => { this.organizations = organizations });
  }

  updateValues(party) {
    this.party = party;
    this.type.setValue(party.type);
    this.category.setValue(party.category);
    this.organization.setValue(party.organization_id);
    this.email.setValue(party.email);
    this.contact.setValue(party.contact);
    this.position.setValue(party.position);
    this.phone.setValue(party.contact_phone);
    this.comment.setValue(party.comment);

    this.getCurrentOrganization();
  }

  editParty(event) {
    if (this.editPartyForm.valid) {
      let organization_id = this.editPartyForm.get("organization").value;

      if (isNaN(this.organization.value)) {
        this.partiesService.createOrganization(this.organization.value).subscribe(result => {
          organization_id = result.organization.id;

          this.partiesService.updateParty(this.party.id, this.editPartyForm.get("type").value, this.editPartyForm.get("category").value, 
          organization_id, this.editPartyForm.get("email").value, this.editPartyForm.get("contact").value,
          this.editPartyForm.get("position").value, this.editPartyForm.get("phone").value, this.editPartyForm.get("comment").value).subscribe(
            res => { 
              this.editPartyForm.reset();
              this.eventEmitter.emit(true);
              this.refreshTableEvent.emit(true);
            },
            err => { console.log(err) }
          );
        }, err => { console.log(err); });
      }
  	  else {
        this.partiesService.updateParty(this.party.id, this.editPartyForm.get("type").value, this.editPartyForm.get("category").value, 
        organization_id, this.editPartyForm.get("email").value, this.editPartyForm.get("contact").value, this.editPartyForm.get("position").value, 
        this.editPartyForm.get("phone").value, this.editPartyForm.get("comment").value).subscribe(
          res => { 
            this.editPartyForm.reset();
            this.eventEmitter.emit(true);
            this.refreshTableEvent.emit(true);
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
      // Validators.required
    ]);
    this.type = new FormControl('', [
      Validators.required
    ]);

  	this.editPartyForm = new FormGroup({
      type: this.type,
      category: this.category,
      organization: this.organization,
      email: this.email,
      contact: this.contact,
      position: this.position,
      phone: this.phone,
      comment: this.comment,
    });
  }

  addTag(name) {
    return { id: name, name: name };
  }

}
