import { Component, OnInit, EventEmitter, Output, ViewChild, ChangeDetectorRef, ElementRef, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { DocumentsService } from '../../documents.service';
import { PartiesService } from '../../../parties-page/parties.service';
import { DealsService } from '../../../deals-page/deals.service';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { FileUploader } from 'ng2-file-upload';
import { PartiesAddModalWindowComponent } from '../../../parties-page/parties-add-modal-window/parties-add-modal-window.component';

@Component({
  selector: 'documents-edit-form',
  templateUrl: './documents-edit-form.component.html',
  styleUrls: ['./documents-edit-form.component.css'],
  providers: [DocumentsService, PartiesService, DealsService]
})
export class DocumentsEditFormComponent implements OnInit {

  public document;

  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions({ cloudName: 'eldarkikcloudinary', uploadPreset: 'default_preset' })
  );
 
  fileLoading: any;
  isOrder: boolean = false;

  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;

  @ViewChild(PartiesAddModalWindowComponent) partiesAddModalWindowComponent: PartiesAddModalWindowComponent;
  @ViewChild('addFileButtonText') addFileButtonText: ElementRef;

  public selects = [
    {items: "types", name: "kind", placeholder: "Тип документа", id: "docTypeSelect"},
    {items: "categories", name: "category", placeholder: "Категория", id: "docCategorySelect"},
    {items: "available_events", name: "status", placeholder: "Статус", id: "statusSelect"},
  ];

  public counterparties = [];
  public orders = [];

  public selectInputs = [
    {name: "counterparty", placeholder: "ИП Пупина Александра Владимировича", title: "Контрагент", items: "counterparties", id: "counterpartiesSelect"}
  ];

  public orderSelectInputs = [
    {name: "number", placeholder: "Номер заказа", title: "Заказ", items: "orders", id: "ordersSelect"}
  ];

  public inputs = [
    {name: "comment", type: "text", placeholder: "Комментарий", big: true}
  ];

  public types = [
    {name: 'Счет', id: 'check'},
    {name: 'Акт', id: 'act'},
    {name: 'Договор', id: 'agreement'},
    {name: 'Накладная', id: 'invoice'},
    {name: 'Прочее', id: 'other'},
    {name: 'Макет', id: 'layout'},
    {name: 'Коммерческое предложение', id: 'commercial_proposal'}
  ];

  public categories = [
    {name: 'Расход', id: "spending"}, 
    {name: 'Доход', id: "income"}
  ];

  editDocumentForm: FormGroup;

  fileName: string;
  fileType: string;
  fileUrl: string;

  available_events = [];

  status: FormControl;
  kind: FormControl;
  category: FormControl;
  counterparty: FormControl;
  number: FormControl;
  comment: FormControl;

  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() updateOrderEdit = new EventEmitter<boolean>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  removeDocument() {
    if (confirm("Удалить данный документ?")) {
      this.documentsService.removeDocument(this.document.id).subscribe(
        res => { 
          this.eventEmitter.emit(true);
          if (this.isOrder) this.updateOrderEdit.emit(true);
          this.refreshTableEvent.emit(true);
        },
        err => { console.log(err) }
      ); 
    }
  }

  forOrder() {
    this.orderSelectInputs = [];
    this.isOrder = true;
    this.editDocumentForm = new FormGroup({
      status: this.status,
      kind: this.kind,
      category: this.category,
      counterparty: this.counterparty,
      comment: this.comment
    });
    
  }

  hideWindow() {
    this.eventEmitter.emit(true);
  }

  getCurrentParty() {
    this.partiesService.getPartiesBySearch(this.document.counterparty.contact_name).subscribe(counterparties => { this.counterparties = counterparties });
  }

  constructor(public formbuilder: FormBuilder, private documentsService: DocumentsService, private dealsService: DealsService, private partiesService: PartiesService, private cd: ChangeDetectorRef) { }

  updateValues(document) {
    this.document = document;

    this.available_events = document.available_events;
    this.status.setValue(document.status.id);
    this.kind.setValue(document.kind.id);
    this.category.setValue(document.category.id);
    this.counterparty.setValue(document.counterparty.id);
    this.number.setValue(document.number);
    this.comment.setValue(document.comment);

    this.getCurrentParty();
  }

  upload(event) {
    this.fileLoading = true;
    this.addFileButtonText.nativeElement.textContent = "Загрузка...";
    this.uploader.uploadAll();

    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
      let res: any = JSON.parse(response);
      console.log(res);

      this.fileLoading = false;
      this.addFileButtonText.nativeElement.innerHTML = res.original_filename;
      this.fileName = res.original_filename;
      this.fileType = res.format;
      this.fileUrl = res.url;
    }

    this.uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
  }

  editDocument() {
    if (this.editDocumentForm.valid) {
	    this.documentsService.updateDocument(this.document.id, this.kind.value.id, this.category.value.id, this.status.value, this.counterparty.value, 
          this.number.value, this.fileUrl, this.comment.value).subscribe(
        res => { 
        this.editDocumentForm.reset();
        if (this.isOrder) this.updateOrderEdit.emit(true);
        this.refreshTableEvent.emit(true);
        this.eventEmitter.emit(true);
        },
        err => { console.log(err) }
      );
    }
  }

  partiesTypeahead = new EventEmitter<string>();
  ordersTypeahead = new EventEmitter<string>();

  private ordersServerSideSearch() {
    this.ordersTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.dealsService.getDealsBySearch(term))
    ).subscribe(x => {
        this.cd.markForCheck();
        this.orders = x;
    }, (err) => {
        console.log(err);
        this.orders = [];
    });
  }

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
      this.fileName = file.name;
      this.fileType = file.type;

      this.addFileButtonText.nativeElement.innerHTML = this.fileName;
    }
  }

  addNewParty(name) {
    this.partiesAddModalWindowComponent.showWithName(name);
  }

  ngOnInit() {
    this.serverSideSearch();
    this.ordersServerSideSearch();

    this.status = new FormControl('', [
      Validators.required
    ]);
    this.kind = new FormControl('', [
      Validators.required
    ]);
    this.category = new FormControl('', [
      Validators.required
    ]);
    this.counterparty = new FormControl('', [
      Validators.required
    ]);
    this.number = new FormControl('', [
      Validators.required,
      Validators.pattern("[0-9]*")
    ]);
    this.comment = new FormControl('', [
      Validators.required
    ]);

    this.editDocumentForm = new FormGroup({
      status: this.status,
      kind: this.kind,
      category: this.category,
      counterparty: this.counterparty,
      number: this.number,
      comment: this.comment
    });
  }

}
