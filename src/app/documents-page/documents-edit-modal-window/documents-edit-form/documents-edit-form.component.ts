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

  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;

  @ViewChild(PartiesAddModalWindowComponent) partiesAddModalWindowComponent: PartiesAddModalWindowComponent;
  @ViewChild('addFileButtonText') addFileButtonText: ElementRef;

  public selects = [
    {items: "types", name: "type", placeholder: "Тип документа", id: "docTypeSelect"},
    {items: "categories", name: "category", placeholder: "Категория", id: "docCategorySelect"},
    {items: "available_events", name: "status", placeholder: "Статус", id: "statusSelect"},
  ];

  public counterparties = [];
  public orders = [];

  public selectInputs = [
    {name: "counterparty", placeholder: "ИП Пупина Александра Владимировича", title: "Контрагент", items: "counterparties", id: "counterpartiesSelect"}
  ];

  public orderSelectInputs = [
    {name: "orderNumber", placeholder: "Номер заказа", title: "Заказ", items: "orders", id: "ordersSelect"}
  ];

  public inputs = [
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

  editDocumentForm: FormGroup;

  fileName: string;
  fileType: string;
  fileUrl: string;

  available_events: any[] = [];

  status: FormControl;
  type: FormControl;
  category: FormControl;
  counterparty: FormControl;
  orderNumber: FormControl;
  comment: FormControl;

  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  removeDocument() {
    if (confirm("Удалить данный документ?")) {
      this.documentsService.removeDocument(this.document.id).subscribe(
        res => { 
          this.eventEmitter.emit(true);
          this.refreshTableEvent.emit(true);
        },
        err => { console.log(err) }
      ); 
    }
  }

  hideWindow() {
    this.eventEmitter.emit(true);
  }

  getCurrentParty() {
    this.partiesService.getPartiesBySearch(this.document.counterparty).subscribe(counterparties => { this.counterparties = counterparties });
  }

  constructor(public formbuilder: FormBuilder, private documentsService: DocumentsService, private dealsService: DealsService, private partiesService: PartiesService, private cd: ChangeDetectorRef) { }

  updateValues(document) {
    this.document = document;

    this.available_events = document.available_events;
    this.status.setValue(document.status);
    this.type.setValue(document.type);
    this.category.setValue(document.category);
    this.counterparty.setValue(document.counterparty_id);
    this.orderNumber.setValue(document.number);
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
  	  this.documentsService.updateDocument(this.document.id, this.type.value, this.category.value, this.status.value, this.counterparty.value, 
            this.orderNumber.value, this.fileUrl, this.comment.value).subscribe(
        res => { 
          this.editDocumentForm.reset();
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

    this.editDocumentForm = new FormGroup({
      status: this.status,
      type: this.type,
      category: this.category,
      counterparty: this.counterparty,
      orderNumber: this.orderNumber,
      comment: this.comment
    });
  }

}
