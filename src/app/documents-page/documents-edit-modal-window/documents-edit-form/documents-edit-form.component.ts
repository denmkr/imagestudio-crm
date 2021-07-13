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
 
  ordersLoading: boolean = false;
  partiesLoading : boolean = false;
  organizationsLoading : boolean = false;
  fileLoading: any;
  isOrder: boolean = false;

  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;

  @ViewChild(PartiesAddModalWindowComponent) partiesAddModalWindowComponent: PartiesAddModalWindowComponent;
  @ViewChild('addFileButtonText') addFileButtonText: ElementRef;

  public statusSelect = {items: "available_events", name: "status", id: "statusSelect"};

  public selects = [
    {items: "types", name: "kind", placeholder: "Тип документа", id: "docTypeSelect"},
    {items: "categories", name: "category", placeholder: "Категория", id: "docCategorySelect"},
  ];

  public counterparties = [];
  public organizations = [];
  public orders = [];
  public available_events = [];

  public selectInputs = [
    {name: "organization", placeholder: "ИП Пупина Александра Владимировича", title: "Организация", items: "organizations", id: "organizationsSelect", bindLabel: "name", loading: "organizationsLoading", typeahead: "organizationsTypeahead", addTag: "addTag"},
    {name: "counterparty", placeholder: "Пупин Александр Владимирович", title: "Контрагент", items: "counterparties", id: "counterpartiesSelect", bindLabel: "contact_name", loading: "partiesLoading", typeahead: "partiesTypeahead"}
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

  changeDocumentStatus(event) {
    if (event.id == "approve") {
      this.changeStatus = true;
    }
  }

  editDocumentForm: FormGroup;
  statusForm: FormGroup;

  fileName: string;
  fileType: string;
  fileUrl: string;

  changeStatus: boolean = false;

  id: number;

  status: FormControl;
  kind: FormControl;
  category: FormControl;
  counterparty: FormControl;
  organization: FormControl;
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

  addTag(name) {
    return { id: name, name: name };
  }

  forOrder() {
    this.orderSelectInputs = [];
    this.selectInputs = [];
    this.isOrder = true;
    this.editDocumentForm = new FormGroup({
      kind: this.kind,
      category: this.category,
      organization: this.organization,
      // counterparty: this.counterparty,
      comment: this.comment
    });
    
  }

  hideWindow() {
    this.eventEmitter.emit(true);
  }

  setOrganization(event) {
    if (event != undefined) {
      if (event.contact_name != null) { // counterparty
        this.getCurrentOrganization(event.organization.name);
        this.organization.setValue(event.organization.id);
      }
      else { // organization
        this.counterparty.setValue("");
        this.getCurrentParties("");
      }
      // this.getCurrentParties(event.contact_name);
      // this.getCurrentOrganization(event.organization.name);
    }
    else {
      this.counterparty.setValue("");
      this.getCurrentParties("");
    }
  }

  getCurrentParties(name) {
    this.partiesService.getPartiesBySearchAndOrganization(name, this.organization.value).subscribe(counterparties => { this.counterparties = counterparties });
  }

  getCurrentOrganization(name) {
    this.partiesService.getOrganizations(name).subscribe(organizations => { this.organizations = organizations });
  }

  constructor(public formbuilder: FormBuilder, private documentsService: DocumentsService, private dealsService: DealsService, private partiesService: PartiesService, private cd: ChangeDetectorRef) { }

  updateValues(document) {
    this.document = document;

    this.id = document.id;
    this.available_events = document.available_events;
    this.status.setValue(document.status.id);
    this.kind.setValue(document.kind.id);
    this.category.setValue(document.category.id);
    if (!this.isOrder) this.counterparty.setValue(document.counterparty.id);
    this.organization.setValue(document.organization.id);
    this.number.setValue(document.number);
    this.comment.setValue(document.comment);

    if (!this.isOrder) this.getCurrentParties(this.document.counterparty.contact_name);
    this.getCurrentOrganization(this.document.organization.name);
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
    if (this.changeStatus) this.documentsService.approveDocument(this.id).subscribe();

    if (this.editDocumentForm.valid) {
      if (isNaN(this.organization.value)) {
        this.partiesService.createOrganization(this.organization.value).subscribe(result => {
          this.documentsService.updateDocument(this.document.id, this.kind.value.id, this.category.value.id, this.status.value, this.counterparty.value, 
            result.organization.id, this.number.value, this.fileUrl, this.comment.value).subscribe(
            res => { 
            this.editDocumentForm.reset();
            if (this.isOrder) this.updateOrderEdit.emit(true);
            this.refreshTableEvent.emit(true);
            this.eventEmitter.emit(true);
            },
            err => { console.log(err) }
          );
        });
      }
      else {
        this.documentsService.updateDocument(this.document.id, this.kind.value.id, this.category.value.id, this.status.value, this.counterparty.value, 
          this.organization.value, this.number.value, this.fileUrl, this.comment.value).subscribe(
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
  }

  organizationsTypeahead = new EventEmitter<string>();
  partiesTypeahead = new EventEmitter<string>();
  ordersTypeahead = new EventEmitter<string>();

  private ordersServerSideSearch() {
    this.ordersLoading = true;
    this.ordersTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.dealsService.getDealsBySearch(term))
    ).subscribe(x => {
        this.cd.markForCheck();
        this.orders = x;
        this.ordersLoading = false;
    }, (err) => {
        console.log(err);
        this.orders = [];
    });
  }

  private serverSideSearch() {
    this.partiesLoading = true;
    this.partiesTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.partiesService.getPartiesBySearch(term))
    ).subscribe(x => {
        this.cd.markForCheck();
        this.counterparties = x;
        this.partiesLoading = false;
    }, (err) => {
        console.log(err);
        this.counterparties = [];
    });
  }

  private organizationServerSideSearch() {
    this.organizationsLoading = true;
    this.organizationsTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.partiesService.getOrganizations(term))
    ).subscribe(x => {
        this.cd.markForCheck();
        this.organizations = x;
        this.organizationsLoading = false;
    }, (err) => {
        console.log(err);
        this.organizations = [];
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
    this.ordersServerSideSearch();
    this.organizationServerSideSearch();
    this.serverSideSearch();

    this.kind = new FormControl('', [
      Validators.required
    ]);
    this.category = new FormControl('', [
      Validators.required
    ]);
    this.counterparty = new FormControl('', [

    ]);
    this.organization = new FormControl('', [
      Validators.required
    ]);
    this.number = new FormControl('', [
      // Validators.required,
      // Validators.pattern("[0-9]*")
    ]);
    this.comment = new FormControl('', [
      // Validators.required
    ]);

    this.editDocumentForm = new FormGroup({
      kind: this.kind,
      category: this.category,
      counterparty: this.counterparty,
      organization: this.organization,
      number: this.number,
      comment: this.comment
    });

    this.status = new FormControl('', [
      Validators.required
    ]);

    this.statusForm = new FormGroup({
      status: this.status
    });

    this.statusForm.reset();
  }

}
