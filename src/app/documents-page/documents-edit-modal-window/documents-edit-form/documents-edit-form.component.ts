import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { DocumentsService } from '../../documents.service';

@Component({
  selector: 'documents-edit-form',
  templateUrl: './documents-edit-form.component.html',
  styleUrls: ['./documents-edit-form.component.css'],
  providers: [DocumentsService]
})
export class DocumentsEditFormComponent implements OnInit {

  public document;

  public selects = [
    {items: "types", name: "type", placeholder: "Тип документа", id: "typeSelect"},
    {items: "categories", name: "category", placeholder: "Категория", id: "categorySelect"}
  ];

  public counterparties = [];

  public selectInputs = [
    {name: "counterparty", placeholder: "ИП Пупина Александра Владимировича", title: "Контрагент", items: "counterparties", id: "counterpartiesSelect"}
  ];

  public inputs = [
    {name: "order", type: "text", title: "Заказ", placeholder: "Заказ", small: true},
    {name: "comment", type: "text", placeholder: "Комментарий", big: true}
  ];

  public types = [
    {text: 'Счет', id: 'invoice'}
  ];

  public categories = [
    {text: 'Расход', id: "expense"}, 
    {text: 'Доход', id: "income"}
  ];

  editDocumentForm: FormGroup;

  type: FormControl;
  category: FormControl;
  counterparty: FormControl;
  order: FormControl;
  comment: FormControl;

  @Output() eventEmitter = new EventEmitter<boolean>();

  removeDocument() {
    this.documentsService.removeDocument(this.document.id);
    this.eventEmitter.emit(true);
  }

  hideWindow() {
    this.eventEmitter.emit(true);
  }

  constructor(public formbuilder: FormBuilder, private documentsService: DocumentsService) { }

  updateValues(document) {
    this.document = document;
    //this.type.setValue(document.type);
    //this.category.setValue(document.category);
    // this.organization.setValue(document.organization);
    this.comment.setValue(document.comment);

  }

  editDocument(event) {
    if (this.editDocumentForm.controls.email.valid) {
      this.editDocumentForm.controls.organization;
  	  this.documentsService.updateDocument(this.document.id, this.editDocumentForm.get("type").value, this.editDocumentForm.get("category").value, 
      this.editDocumentForm.get("organization").value, this.editDocumentForm.get("email").value, this.editDocumentForm.get("contact").value,
      this.editDocumentForm.get("position").value, this.editDocumentForm.get("phone").value, this.editDocumentForm.get("comment").value);
      
      this.editDocumentForm.reset();
      this.eventEmitter.emit(true);
    }
  }

  ngOnInit() {

  	this.type = new FormControl('', [
      Validators.required
    ]);
    this.category = new FormControl('', [
      Validators.required
    ]);
    this.counterparty = new FormControl('', [
      Validators.required
    ]);
    this.order = new FormControl('', [
      Validators.required
    ]);
    this.comment = new FormControl('', [
      Validators.required
    ]);

    this.editDocumentForm = new FormGroup({
      type: this.type,
      category: this.category,
      counterparty: this.counterparty,
      order: this.order,
      comment: this.comment
    });
  }

}
