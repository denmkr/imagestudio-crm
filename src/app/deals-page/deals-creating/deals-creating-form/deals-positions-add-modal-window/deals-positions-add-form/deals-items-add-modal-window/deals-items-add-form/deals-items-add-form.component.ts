import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { PartiesService } from '../../../../../../../parties-page/parties.service';
import { WarehouseService } from '../../../../../../../warehouse-page/warehouse.service';
import { DocumentsAddModalWindowComponent } from '../../../../../../../documents-page/documents-add-modal-window/documents-add-modal-window.component';

@Component({
  selector: 'deals-items-add-form',
  templateUrl: './deals-items-add-form.component.html',
  styleUrls: ['./deals-items-add-form.component.css'],
  providers: [WarehouseService, PartiesService]
})
export class DealsItemsAddFormComponent implements OnInit {

  @ViewChild(DocumentsAddModalWindowComponent) documentsAddModalWindowComponent: DocumentsAddModalWindowComponent;

  @HostBinding('class.active') activeClass: boolean = false;
  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;
  smallWindow = true;

  public selectInputs = [
  	{name: "product", placeholder: "Выберите товар", title: "Товар", items: "products", id: "productsSelect", typeahead: "productsTypeahead"},
    {name: "organization", placeholder: "ИП Пупина Александра Владимировича", title: "Организация", items: "organizations", id: "organizationsSelect", typeahead: "organizationsTypeahead"},
  ];

  public inputs = [
    {name: "prime_price", type: "text", title: "Стоимость", tiny: true},
    {name: "description", type: "text", title: "Тех. задание"},
  ];

  public organizations = [];
  public products = [];
  public documents = [];

  newDealsItemForm: FormGroup;

  product: FormControl;
  organization: FormControl;
  prime_price: FormControl;
  description: FormControl;

  @Output() refreshPositionItems = new EventEmitter<any>();
  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  addPositionItems() {
    let itemForm = this.newDealsItemForm.value;
    itemForm.documents = this.documents.map(document => {
      let newDocument = {
        number: document.orderNumber,
        kind: document.type.id,
        category: document.category.id,
        url: document.url,
        comment: document.comment,
        counterparty: {
          id: document.counterparty
        }
      };

      return newDocument;
    });

    console.log(itemForm);

    this.refreshPositionItems.emit(itemForm);
  }

  addNewProduct(name) {
    this.warehouseService.createProduct(name).subscribe(product => {
      let fieldProduct = {
        id: product.id,
        text: product.name
      };
      this.product.setValue(fieldProduct);
    });
  }

  constructor(public formbuilder: FormBuilder, private warehouseService: WarehouseService, private partiesService: PartiesService, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  createParty(event) {
    if (this.newDealsItemForm.valid) {
      let organization_id = this.newDealsItemForm.get("organization").value;
      
      if (isNaN(this.organization.value)) {
        this.partiesService.createOrganization(this.organization.value).subscribe(result => {
          organization_id = result.organization.id;

          this.partiesService.createNewParty(this.newDealsItemForm.get("type").value, this.newDealsItemForm.get("category").value, 
          organization_id, this.newDealsItemForm.get("email").value, this.newDealsItemForm.get("contact").value,
          this.newDealsItemForm.get("position").value, this.newDealsItemForm.get("phone").value, this.newDealsItemForm.get("comment").value).subscribe(
            res => { 
              this.newDealsItemForm.reset();
              this.refreshTableEvent.emit(true);
              this.eventEmitter.emit(true);
            },
            err => { console.log(err) }
          );
        }, err => { console.log(err); });
      }
      else {
        this.partiesService.createNewParty(this.newDealsItemForm.get("type").value, this.newDealsItemForm.get("category").value, 
        organization_id, this.newDealsItemForm.get("email").value, this.newDealsItemForm.get("contact").value,
        this.newDealsItemForm.get("position").value, this.newDealsItemForm.get("phone").value, this.newDealsItemForm.get("comment").value).subscribe(
          res => { 
            this.newDealsItemForm.reset();
            this.refreshTableEvent.emit(true);
            this.eventEmitter.emit(true);
          },
          err => { console.log(err) }
        );
      }
    }
    else {
      this.validationClass = true;
    }
  }

  organizationsTypeahead = new EventEmitter<string>();
  productsTypeahead = new EventEmitter<string>();

  private serverSideSearchForProducts() {
    this.productsTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.warehouseService.getProducts(term))
    ).subscribe(x => {
        this.cd.markForCheck();
        this.products = x;
    }, (err) => {
        console.log(err);
        this.products = [];
    });
  }

  private serverSideSearchForOrganizations() {
    this.organizationsTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.partiesService.getOrganizations(term))
    ).subscribe(x => {
        this.cd.markForCheck();
        this.organizations = x;
    }, (err) => {
        console.log(err);
        this.organizations = [];
    });
  }

  addNewDocumentItem() {
    this.documentsAddModalWindowComponent.show();
  }

  updateTable(event) {
    this.documents.push(event);
  }

  ngOnInit() {
  	this.serverSideSearchForOrganizations();
  	this.serverSideSearchForProducts();

    this.prime_price = new FormControl('', [
      Validators.required
    ]);
    this.description = new FormControl('', [
      Validators.required
    ]);
    this.product = new FormControl('', [
      Validators.required
    ]);
    this.organization = new FormControl('', [
      Validators.required
    ]);

  	this.newDealsItemForm = new FormGroup({
      prime_price: this.prime_price,
      product: this.product,
      description: this.description,
      organization: this.organization
    });

    this.newDealsItemForm.reset();
  }

}

