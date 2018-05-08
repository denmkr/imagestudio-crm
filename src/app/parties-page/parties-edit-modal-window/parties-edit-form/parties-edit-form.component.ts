import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { PartiesService } from '../../parties.service';

@Component({
  selector: 'parties-edit-form',
  templateUrl: './parties-edit-form.component.html',
  styleUrls: ['./parties-edit-form.component.css'],
  providers: [PartiesService]
})
export class PartiesEditFormComponent implements OnInit {

  public selects = [
    {items: "types", name: "type", placeholder: "Тип", id: "typeSelect"},
    {items: "categories", name: "category", placeholder: "Категория", id: "categorySelect"}
  ];

  public inputs = [
    {name: "organization", type: "text", placeholder: "ИП Пупина Александра Владимировича", title: "Организация"},
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

  hideWindow() {
    this.eventEmitter.emit(true);
  }

  constructor(public formbuilder: FormBuilder, private partiesService: PartiesService) { }

  editParty(event) {
    if (this.editPartyForm.controls.email.valid) {
      this.editPartyForm.controls.organization;
  	  this.partiesService.createNewParty(this.editPartyForm.get("type").value, this.editPartyForm.get("category").value, 
      this.editPartyForm.get("organization").value, this.editPartyForm.get("email").value, this.editPartyForm.get("contact").value,
      this.editPartyForm.get("position").value, this.editPartyForm.get("phone").value, this.editPartyForm.get("comment").value);
      
      this.editPartyForm.reset();
      this.eventEmitter.emit(true);
    }
  }

  ngOnInit() {
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
