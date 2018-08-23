import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, ViewChild, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { DocumentsService } from '../../documents.service';
import { PartiesService } from '../../../parties-page/parties.service';

@Component({
  selector: 'documents-add-form',
  templateUrl: './documents-add-form.component.html',
  styleUrls: ['./documents-add-form.component.css'],
  providers: [DocumentsService, PartiesService]
})
export class DocumentsAddFormComponent implements OnInit {

  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;

  @ViewChild('addFileButtonText') addFileButtonText: ElementRef;

  public selects = [
    {items: "types", name: "type", placeholder: "Тип документа", id: "docTypeSelect"},
    {items: "categories", name: "category", placeholder: "Категория", id: "docCategorySelect"}
  ];

  public counterparties = [];

  public selectInputs = [
    {name: "counterparty", placeholder: "ИП Пупина Александра Владимировича", title: "Контрагент", items: "counterparties", id: "counterpartiesSelect"}
  ];

  public inputs = [
    {name: "orderNumber", type: "text", title: "Заказ", placeholder: "Номер", small: true, onlyNumber: true},
    {name: "comment", type: "text", placeholder: "Комментарий", big: true}
  ];

  public types = [
    {text: 'Счет', id: 'check'},
    {text: 'Акт', id: 'act'},
    {text: 'Договор', id: 'agreement'},
    {text: 'Накладная', id: 'invoice'},
    {text: 'Прочее', id: 'other'},
    {text: 'Макет', id: 'layout'},
    {text: 'Коммерческое предложение', id: 'commercial_proposal'}
  ];

  public categories = [
    {text: 'Расход', id: "spending"}, 
    {text: 'Доход', id: "income"}
  ];

  newDocumentForm: FormGroup;

  fileName: string;
  fileType: string;
  file: File;

  type: FormControl;
  category: FormControl;
  counterparty: FormControl;
  orderNumber: FormControl;
  comment: FormControl;

  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  constructor(public formbuilder: FormBuilder, private documentsService: DocumentsService, private elRef: ElementRef, private renderer: Renderer, private partiesService: PartiesService, private cd: ChangeDetectorRef) { }

  createDocument() {
    if (this.newDocumentForm.valid) {
      if (this.fileName != "" && this.fileName != null && this.fileName != undefined) {

        let types = this.fileType.split("/");
        let type = types[types.length - 1];
        console.log(type);

        this.documentsService.generateUrlForFile(this.fileName, type).subscribe(
          res => { 
            console.log(res.result.upload_url);
            this.documentsService.uploadfileAWSS3(res.result.upload_url, this.fileType, this.file).subscribe(
              res => { 
                console.log(res)
              },
              err => { console.log(err.error) }
            );

            this.documentsService.createNewDocument(this.type.value, this.category.value, this.counterparty.value, 
            this.orderNumber.value, res.result.public_url, this.comment.value).subscribe(
              res => { 
                this.newDocumentForm.reset();
                this.refreshTableEvent.emit(true);
                this.eventEmitter.emit(true);
              },
              err => { console.log(err) }
            );
          },
          err => { console.log(err) }
        );
      }
      else {
        //
      }
    }
    else {
      this.validationClass = true;
      if (this.fileName === "" || this.fileName === null || this.fileName === undefined) {
        //
      }
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

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.file = file;
      this.fileName = file.name;
      this.fileType = file.type;

      this.addFileButtonText.nativeElement.innerHTML = this.fileName;
    }
  }

  resetForm() {
    this.newDocumentForm.reset();
    this.addFileButtonText.nativeElement.innerHTML = "Добавить файл";
    this.fileName = "";
    this.fileType = "";
  }

  addTag(name) {
    return { id: name, text: name };
  }

  ngOnInit() {
    this.serverSideSearch();

    this.type = new FormControl('', [
      Validators.required
    ]);
    this.category = new FormControl('', [
      Validators.required
    ]);
    this.counterparty = new FormControl('', [
      Validators.required
    ]);
    this.orderNumber = new FormControl('', [
      Validators.required,
      Validators.pattern("[0-9]*")
    ]);
    this.comment = new FormControl('', [
      Validators.required
    ]);

  	this.newDocumentForm = new FormGroup({
      type: this.type,
      category: this.category,
      counterparty: this.counterparty,
      orderNumber: this.orderNumber,
      comment: this.comment
    });

    this.newDocumentForm.reset();
  }

}
