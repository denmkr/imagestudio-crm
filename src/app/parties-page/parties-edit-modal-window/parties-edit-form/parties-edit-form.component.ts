import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { PartiesService } from '../../parties.service';

@Component({
  selector: 'parties-edit-form',
  templateUrl: './parties-edit-form.component.html',
  styleUrls: ['./parties-edit-form.component.css'],
  providers: [PartiesService]
})
export class PartiesEditFormComponent implements OnInit {

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

  removeParty() {
    this.partiesService.removeParty(this.party.id);
    this.eventEmitter.emit(true);
  }

  hideWindow() {
    this.eventEmitter.emit(true);
  }

  constructor(public formbuilder: FormBuilder, private partiesService: PartiesService) { }

  getAllOrganizations() {
    this.partiesService.getOrganizations().subscribe(organizations => { this.organizations = organizations });
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

  }

  editParty(event) {
    if (this.editPartyForm.controls.email.valid) {
      this.editPartyForm.controls.organization;
  	  this.partiesService.updateParty(this.party.id, this.editPartyForm.get("type").value, this.editPartyForm.get("category").value, 
      this.editPartyForm.get("organization").value, this.editPartyForm.get("email").value, this.editPartyForm.get("contact").value,
      this.editPartyForm.get("position").value, this.editPartyForm.get("phone").value, this.editPartyForm.get("comment").value);
      
      this.editPartyForm.reset();
      this.eventEmitter.emit(true);
    }
  }

  ngOnInit() {
    this.getAllOrganizations();

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
      Validators.pattern("[0-9]*")
    ]);
    this.comment = new FormControl('', [
      Validators.required
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

}
