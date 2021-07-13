import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { PartiesService } from '../../../../parties-page/parties.service';
import { WarehouseService } from '../../../../warehouse-page/warehouse.service';
import { OrdersService } from '../../../orders.service';
import { DocumentsAddModalWindowComponent } from '../../../../documents-page/documents-add-modal-window/documents-add-modal-window.component';

@Component({
  selector: 'orders-item-create-form',
  templateUrl: './orders-item-create-form.component.html',
  styleUrls: ['./orders-item-create-form.component.css'],
  providers: [WarehouseService, PartiesService, OrdersService]
})
export class OrdersItemCreateFormComponent implements OnInit {

  @ViewChild(DocumentsAddModalWindowComponent) documentsAddModalWindowComponent: DocumentsAddModalWindowComponent;

  @HostBinding('class.active') activeClass: boolean = false;
  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;
  smallWindow = true;

  public selectInputs = [
  	{name: "product", placeholder: "Выберите товар", title: "Товар", items: "products", id: "productsSelect", typeahead: "productsTypeahead"}
  ];

  public organizationInput = [
    {name: "organization", placeholder: "ИП Пупина Александра Владимировича", title: "Подрядчик", items: "organizations", id: "organizationsSelect", typeahead: "organizationsTypeahead"}
  ]

  public inputs = [
    {name: "prime_price", type: "text", title: "Стоимость", tiny: true},
    {name: "description", type: "text", title: "Тех. задание"},
  ];

  public organizations = [];
  public products = [];
  public documents = [];

  public position_id = -1;

  newOrdersItemForm: FormGroup;

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

    if (this.position_id >= 0) {
      this.ordersService.createNewItem(this.organization.value.id, this.product.value.id, this.position_id, this.prime_price.value, this.description.value, this.documents).subscribe(
        result => { 
          this.refreshPositionItems.emit(true);
        }
      );
    }
    else {
      let itemForm = this.newOrdersItemForm.value;
      itemForm.documents = this.documents.map(document => {
        let newDocument = {
          number: document.orderNumber,
          kind: document.kind.id,
          category: document.category.id,
          url: document.url,
          comment: document.comment,
          /*
          counterparty: {
            id: document.counterparty
          }
          */
          organization: {
            id: this.organization.value.id
          }
        };

        return newDocument;
      });

      this.refreshPositionItems.emit(itemForm);
    }

    
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

  constructor(public formbuilder: FormBuilder, private warehouseService: WarehouseService, private ordersService: OrdersService, private partiesService: PartiesService, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  createParty(event) {
    if (this.newOrdersItemForm.valid) {
      let organization_id = this.newOrdersItemForm.get("organization").value;
      
      if (isNaN(this.organization.value)) {
        this.partiesService.createOrganization(this.organization.value).subscribe(result => {
          organization_id = result.organization.id;

          this.partiesService.createNewParty(this.newOrdersItemForm.get("type").value, this.newOrdersItemForm.get("category").value, 
          organization_id, this.newOrdersItemForm.get("email").value, this.newOrdersItemForm.get("contact").value,
          this.newOrdersItemForm.get("position").value, this.newOrdersItemForm.get("phone").value, this.newOrdersItemForm.get("comment").value).subscribe(
            res => { 
              this.newOrdersItemForm.reset();
              this.refreshTableEvent.emit(true);
              this.eventEmitter.emit(true);
            },
            err => { console.log(err) }
          );
        }, err => { console.log(err); });
      }
      else {
        this.partiesService.createNewParty(this.newOrdersItemForm.get("type").value, this.newOrdersItemForm.get("category").value, 
        organization_id, this.newOrdersItemForm.get("email").value, this.newOrdersItemForm.get("contact").value,
        this.newOrdersItemForm.get("position").value, this.newOrdersItemForm.get("phone").value, this.newOrdersItemForm.get("comment").value).subscribe(
          res => { 
            this.newOrdersItemForm.reset();
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
  
  addNewDocumentReceiptItem() {
    // this.documentsAddModalWindowComponent.showForItemReceipt();
  }

  addNewDocumentTemplateItem() {
    // this.documentsAddModalWindowComponent.showForItemTemplate();
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

  	this.newOrdersItemForm = new FormGroup({
      prime_price: this.prime_price,
      product: this.product,
      description: this.description,
      organization: this.organization
    });

    this.newOrdersItemForm.reset();
  }

}

