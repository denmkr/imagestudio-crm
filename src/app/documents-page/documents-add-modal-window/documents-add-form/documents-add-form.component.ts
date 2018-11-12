import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, ViewChild, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'
import { DocumentsService } from '../../documents.service';
import { PartiesService } from '../../../parties-page/parties.service';
import { DealsService } from '../../../deals-page/deals.service';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { FileUploader } from 'ng2-file-upload';
import { PartiesAddModalWindowComponent } from '../../../parties-page/parties-add-modal-window/parties-add-modal-window.component';

@Component({
  selector: 'documents-add-form',
  templateUrl: './documents-add-form.component.html',
  styleUrls: ['./documents-add-form.component.css'],
  providers: [DocumentsService, PartiesService, DealsService]
})
export class DocumentsAddFormComponent implements OnInit {

  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions({ cloudName: 'eldarkikcloudinary', uploadPreset: 'default_preset' })
  );
 
  fileLoading: any;

  @HostBinding('class.validation') validationClass: boolean = false;
  @ViewChild(PartiesAddModalWindowComponent) partiesAddModalWindowComponent: PartiesAddModalWindowComponent;
  loading = false;

  @ViewChild('addFileButtonText') addFileButtonText: ElementRef;

  public selects = [
    {items: "types", name: "type", placeholder: "Тип документа", id: "docTypeSelect"},
    {items: "categories", name: "category", placeholder: "Категория", id: "docCategorySelect"}
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

  newDocumentForm: FormGroup;

  fileName: string;
  fileUrl: string;
  fileType: string;
  file: File;

  type: FormControl;
  category: FormControl;
  counterparty: FormControl;
  orderNumber: FormControl;
  comment: FormControl;

  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() updateOrder = new EventEmitter<any>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  constructor(public formbuilder: FormBuilder, private documentsService: DocumentsService, private dealsService: DealsService, private elRef: ElementRef, private renderer: Renderer, private partiesService: PartiesService, private cd: ChangeDetectorRef) { }

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

  createDocument() {
    if (this.newDocumentForm.valid) {
      if (this.fileName != "" && this.fileName != null && this.fileName != undefined) {

        this.documentsService.createNewDocument(this.type.value, this.category.value, this.counterparty.value, 
        this.orderNumber.value, this.fileUrl, this.comment.value).subscribe(
          res => { 
            let form = this.newDocumentForm.value;
            form.url = this.fileUrl;
            this.updateOrder.emit(form);
            this.newDocumentForm.reset();
            this.eventEmitter.emit(true);
            this.refreshTableEvent.emit(true);
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

  addNewParty(name) {
    this.partiesAddModalWindowComponent.showWithName(name);
  }

  ngOnInit() {
    this.serverSideSearch();
    this.ordersServerSideSearch();

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
      Validators.required
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
