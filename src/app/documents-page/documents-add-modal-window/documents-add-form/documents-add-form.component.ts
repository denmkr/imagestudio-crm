import { Component, OnInit, EventEmitter, Output, ElementRef, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { DocumentsService } from '../../documents.service';

@Component({
  selector: 'documents-add-form',
  templateUrl: './documents-add-form.component.html',
  styleUrls: ['./documents-add-form.component.css'],
  providers: [DocumentsService]
})
export class DocumentsAddFormComponent implements OnInit {

  @HostBinding('class.active') activeClass: boolean = false;

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

  newDocumentForm: FormGroup;

  type: FormControl;
  category: FormControl;
  counterparty: FormControl;
  order: FormControl;
  comment: FormControl;

  @Output() eventEmitter = new EventEmitter<boolean>();

  hideWindow() {
    this.eventEmitter.emit(true);
  }

  constructor(public formbuilder: FormBuilder, private documentsService: DocumentsService, private elRef: ElementRef, private renderer: Renderer) { }

  createDocument(event) {
    if (this.newDocumentForm.controls.email.valid) {
      this.newDocumentForm.controls.counterparties;
  	  this.documentsService.createNewDocument(this.newDocumentForm.get("type").value, this.newDocumentForm.get("category").value, 
      this.newDocumentForm.get("counterparty").value, this.newDocumentForm.get("comment").value);
      
      this.newDocumentForm.reset();
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
    

  	this.newDocumentForm = new FormGroup({
      type: this.type,
      category: this.category,
      counterparty: this.counterparty,
      order: this.order,
      comment: this.comment
    });
  }

}
