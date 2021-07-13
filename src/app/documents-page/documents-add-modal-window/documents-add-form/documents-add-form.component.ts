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

  ordersLoading: boolean = false;
  partiesLoading : boolean = false;
  organizationsLoading : boolean = false;
 
  fileLoading: any;
  isOrder: boolean = false;
  isItem: boolean = false;

  @HostBinding('class.validation') validationClass: boolean = false;
  @ViewChild(PartiesAddModalWindowComponent) partiesAddModalWindowComponent: PartiesAddModalWindowComponent;
  loading = false;

  @ViewChild('addFileButtonText') addFileButtonText: ElementRef;

  public selects = [
    {items: "types", name: "kind", placeholder: "Тип документа", id: "docTypeSelect"},
    {items: "categories", name: "category", placeholder: "Категория", id: "docCategorySelect"}
  ];

  public counterparties = [];
  public organizations = [];
  public orders = [];

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

  newDocumentForm: FormGroup;

  fileName: string;
  fileUrl: string;
  fileType: string;
  file: File;

  kind: FormControl;
  category: FormControl;
  counterparty: FormControl;
  organization: FormControl;
  number: FormControl;
  comment: FormControl;

  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() updateOrder = new EventEmitter<any>();
  @Output() updateItem = new EventEmitter<any>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  addTag(name) {
    return { id: name, name: name };
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

  setOrganization(event) {
    if (event != undefined) {
      if (event.contact_name != null) { // counterparty
        this.getCurrentOrganization(event.organization.name);
        this.organization.setValue(event.organization.id);
      }
      else { // organization
        this.counterparty.setValue(null);
        this.getCurrentParties("");
      }
      // this.getCurrentParties(event.contact_name);
      // this.getCurrentOrganization(event.organization.name);
    }
    else {
      this.counterparty.setValue(null);
      this.getCurrentParties("");
    }
  }

  getCurrentParties(name) {
    this.partiesService.getPartiesBySearchAndOrganization(name, this.organization.value).subscribe(counterparties => { this.counterparties = counterparties });
  }

  getCurrentOrganization(name) {
    this.partiesService.getOrganizations(name).subscribe(organizations => { this.organizations = organizations });
  }

  createDocument() {

    if (this.newDocumentForm.valid) {
      if (this.fileName != "" && this.fileName != null && this.fileName != undefined) {
        if (this.isOrder) {
          let form = this.newDocumentForm.value;
          form.url = this.fileUrl;
          form.status = {
            id: "pending",
            name: "Не подписано"
          }
          if (form.counterparty == null) {
            form.counterparty = {
              id: null
            }
          }
          else {
            form.counterparty = {
              id: form.counterparty
            }
          }
          form.organization = {
            id: form.organization
          }
          this.updateOrder.emit(form);
          this.newDocumentForm.reset();
          this.eventEmitter.emit(true);
          this.refreshTableEvent.emit(true);
        }
        else {
          if (this.isItem) {
            let form = this.newDocumentForm.value;
            form.url = this.fileUrl;
            form.status = {
              id: "pending",
              name: "Не подписано"
            }
            form.organization = {
              id: form.organization
            }
            if (form.counterparty == null) {
              form.counterparty = {
                id: null
              }
            }
            else {
              form.counterparty = {
                id: form.counterparty
              }
            }
            this.updateItem.emit(form);
            this.newDocumentForm.reset();
            this.eventEmitter.emit(true);
            // this.refreshTableEvent.emit(true);
          }
          else {
            if (isNaN(this.organization.value)) {
              this.partiesService.createOrganization(this.organization.value).subscribe(result => {
                this.documentsService.createNewDocument(this.kind.value.id, this.category.value.id, this.counterparty.value, result.organization.id, this.number.value, this.fileUrl, this.comment.value).subscribe(
                  res => { 
                    let form = this.newDocumentForm.value;
                    form.url = this.fileUrl;
                    form.status = {
                      id: "pending",
                      name: "Не подписано"
                    }
                    if (form.counterparty == null) {
                      form.counterparty = {
                        id: null
                      }
                    }
                    else {
                      form.counterparty = {
                        id: form.counterparty
                      }
                    }
                    form.organization = {
                      id: form.organization
                    }
                    this.updateOrder.emit(form);
                    this.newDocumentForm.reset();
                    this.eventEmitter.emit(true);
                    this.refreshTableEvent.emit(true);
                  },
                  err => { console.log(err) }
                );
              });
            }
            else {
              this.documentsService.createNewDocument(this.kind.value.id, this.category.value.id, this.counterparty.value, this.organization.value, this.number.value, this.fileUrl, this.comment.value).subscribe(
                res => { 
                  let form = this.newDocumentForm.value;
                  form.url = this.fileUrl;
                  form.status = {
                    id: "pending",
                    name: "Не подписано"
                  }
                  if (form.counterparty == null) {
                    form.counterparty = {
                      id: null
                    }
                  }
                  else {
                    form.counterparty = {
                      id: form.counterparty
                    }
                  }
                  form.organization = {
                    id: form.organization
                  }
                  this.updateOrder.emit(form);
                  this.newDocumentForm.reset();
                  this.eventEmitter.emit(true);
                  this.refreshTableEvent.emit(true);
                },
                err => { console.log(err) }
              );
            }
            
          }
       
        }
        
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
  organizationsTypeahead = new EventEmitter<string>();

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
        switchMap(term => this.partiesService.getPartiesBySearchAndOrganization(term, this.organization.value))
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

  forOrder() {
    this.orderSelectInputs = [];
    this.isOrder = true;

    this.newDocumentForm = new FormGroup({
      kind: this.kind,
      category: this.category,
      organization: this.organization,
      comment: this.comment
    });
    
  }


  forItemReceipt(organizationId) {
    this.orderSelectInputs = [];
    this.selects = [];
    this.selectInputs = [];
    this.isItem = true;

    this.category.setValue({id: "spending", name: "Расход"});
    this.kind.setValue({name: 'Счет', id: 'check'});
    this.organization.setValue(organizationId);

    if (organizationId == null) {
      this.newDocumentForm = new FormGroup({
        kind: this.kind,
        category: this.category,
        comment: this.comment
      });
    }
    else {
      this.newDocumentForm = new FormGroup({
        kind: this.kind,
        category: this.category,
        organization: this.organization,
        comment: this.comment
      });
    }

    
  }

  forItemTemplate(organizationId) {
    this.orderSelectInputs = [];
    this.selects = [];
    this.selectInputs = [];
    this.isItem = true;

    this.category.setValue({id: "spending", name: "Расход"});
    this.kind.setValue({name: 'Макет', id: 'layout'});
    this.organization.setValue(organizationId);

    if (organizationId == null) {
      this.newDocumentForm = new FormGroup({
        kind: this.kind,
        category: this.category,
        comment: this.comment
      });
    }
    else {
      this.newDocumentForm = new FormGroup({
        kind: this.kind,
        category: this.category,
        organization: this.organization,
        comment: this.comment
      });
    }
  }

  ngOnInit() {
    this.serverSideSearch();
    this.ordersServerSideSearch();
    this.organizationServerSideSearch();

    this.kind = new FormControl('', [
      Validators.required
    ]);
    this.category = new FormControl('', [
      Validators.required
    ]);
    this.counterparty = new FormControl('');
    this.organization = new FormControl('', [
      Validators.required
    ]);
    this.comment = new FormControl('');
    this.number = new FormControl('');

    this.newDocumentForm = new FormGroup({
      kind: this.kind,
      category: this.category,
      counterparty: this.counterparty,
      organization: this.organization,
      number: this.number,
      comment: this.comment
    });

    this.newDocumentForm.reset();
  }

}
