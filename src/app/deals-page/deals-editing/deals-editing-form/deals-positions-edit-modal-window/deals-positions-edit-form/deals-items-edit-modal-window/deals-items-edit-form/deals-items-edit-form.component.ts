import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { PartiesService } from '../../../../../../../parties-page/parties.service';
import { WarehouseService } from '../../../../../../../warehouse-page/warehouse.service';
import { DealsService } from '../../../../../../deals.service';
import { DocumentsAddModalWindowComponent } from '../../../../../../../documents-page/documents-add-modal-window/documents-add-modal-window.component';
import { PartiesAddModalWindowComponent } from '../../../../../../../parties-page/parties-add-modal-window/parties-add-modal-window.component';

@Component({
  selector: 'deals-items-edit-form',
  templateUrl: './deals-items-edit-form.component.html',
  styleUrls: ['./deals-items-edit-form.component.css'],
  providers: [WarehouseService, PartiesService, DealsService]
})
export class DealsItemsEditFormComponent implements OnInit {

  @ViewChild(DocumentsAddModalWindowComponent) documentsAddModalWindowComponent: DocumentsAddModalWindowComponent;
  @ViewChild(PartiesAddModalWindowComponent) partiesAddModalWindowComponent: PartiesAddModalWindowComponent;

  @HostBinding('class.active') activeClass: boolean = false;
  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;
  smallWindow = true;

  public selectInputs = [
    {name: "product", placeholder: "Выберите товар", title: "Товар", items: "products", id: "productsSelect", typeahead: "productsTypeahead", addTag: "addTag"},
    {name: "organization", placeholder: "ИП Пупина Александра Владимировича", title: "Подрядчик", items: "organizations", id: "organizationsSelect", typeahead: "organizationsTypeahead"},
  ];

  public inputs = [
    {name: "prime_price", type: "text", title: "Стоимость", tiny: true},
    {name: "description", type: "text", title: "Тех. задание"},
  ];

  public organizations = [];
  public products = [];
  public documents = [];
  public position_id;

  newDealsItemForm: FormGroup;

  id: number;
  product: FormControl;
  organization: FormControl;
  prime_price: FormControl;
  description: FormControl;

  @Output() refreshPositionItems = new EventEmitter<boolean>();
  @Output() refreshPositionItemsRemove = new EventEmitter<boolean>();
  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  addTag(name) {
    return { id: null, name: name };
  }

  addNewParty(name) {
    this.partiesAddModalWindowComponent.showWithOrganization(name);
  }

  updateOrganization(event) {
    this.organization.setValue(event);
    this.getCurrentOrganization(event.name);
  }

  getCurrentOrganization(name) {
    this.partiesService.getOrganizations(name).subscribe(organizations => { this.organizations = organizations });
  }

  addPositionItems() {

    let organization_id = this.organization.value.id;

    if (organization_id == null) {
      this.partiesService.createOrganization(this.organization.value.name).subscribe(result => {
        organization_id = result.organization.id;
        let product_id = this.product.value.id;

        if (product_id == null) {
          this.warehouseService.createProduct(this.product.value.name).subscribe(product => {
            product_id = product.id;
            this.product.setValue(product);
            this.dealsService.editItemById(this.id, organization_id, product_id, this.position_id, this.prime_price.value, this.description.value, this.documents).subscribe(
              result => { 
                let itemForm = this.newDealsItemForm.value;
                itemForm.documents = this.documents.map(document => {
                  let newDocument = {
                    number: document.number,
                    kind: document.kind,
                    category: document.category,
                    url: document.url,
                    comment: document.comment,
                    organization: {
                      id: organization_id
                    }
                  };

                  return newDocument;
                });

                this.refreshPositionItems.emit(true);
              }
            );
          });
        }
        else {
          this.dealsService.editItemById(this.id, organization_id, product_id, this.position_id, this.prime_price.value, this.description.value, this.documents).subscribe(
            result => { 
              let itemForm = this.newDealsItemForm.value;
              itemForm.documents = this.documents.map(document => {
                let newDocument = {
                  number: document.number,
                  kind: document.kind,
                  category: document.category,
                  url: document.url,
                  comment: document.comment,
                  organization: {
                    id: organization_id
                  }
                };

                return newDocument;
              });

              this.refreshPositionItems.emit(true);
            }
          );
        }

      });
    }
    else {
      let product_id = this.product.value.id;

      if (product_id == null) {
        this.warehouseService.createProduct(this.product.value.name).subscribe(product => {
          product_id = product.id;
          this.product.setValue(product);

          this.dealsService.editItemById(this.id, this.organization.value.id, product_id, this.position_id, this.prime_price.value, this.description.value, this.documents).subscribe(
            result => { 
              let itemForm = this.newDealsItemForm.value;
              itemForm.documents = this.documents.map(document => {
                let newDocument = {
                  number: document.number,
                  kind: document.kind,
                  category: document.category,
                  url: document.url,
                  comment: document.comment,
                  organization: {
                    id: this.organization.value.id
                  }
                };

                return newDocument;
              });

              this.refreshPositionItems.emit(true);
            }
          );
        });
      }
      else {
        this.dealsService.editItemById(this.id, this.organization.value.id, product_id, this.position_id, this.prime_price.value, this.description.value, this.documents).subscribe(
          result => { 
            let itemForm = this.newDealsItemForm.value;
            itemForm.documents = this.documents.map(document => {
              let newDocument = {
                number: document.number,
                kind: document.kind,
                category: document.category,
                url: document.url,
                comment: document.comment,
                organization: {
                  id: this.organization.value.id
                }
              };

              return newDocument;
            });

            this.refreshPositionItems.emit(true);
          }
        );
      }
      
    }
    
  }

  remove() {
    this.dealsService.removeItemById(this.id).subscribe(result => {
      this.refreshPositionItemsRemove.emit(true);
    });
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

  constructor(public formbuilder: FormBuilder, private warehouseService: WarehouseService, private dealsService: DealsService, private partiesService: PartiesService, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

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
    this.documentsAddModalWindowComponent.showForItemReceipt(this.organization.value);
  }

  addNewDocumentTemplateItem() {
    this.documentsAddModalWindowComponent.showForItemTemplate(this.organization.value);
  }

  updateTable(event) {
    this.documents.push(event);
  }

  /*

  updateTable(event) {
    this.dealsService.getItemById(this.id.toString()).subscribe(item => {
      console.log(item);
      this.documents = item.documents;
    });
    //this.documents.push(event);
  }
  */

  updateData(item, positionId) {
    this.position_id = positionId;
    this.id = item.id;
    this.product.setValue(item.product);
    this.documents = item.documents;
    this.organization.setValue(item.organization);
    this.prime_price.setValue(item.prime_price);
    this.description.setValue(item.description);
  }

  ngOnInit() {
    this.serverSideSearchForOrganizations();
    this.serverSideSearchForProducts();

    this.prime_price = new FormControl('', [
      Validators.required
    ]);
    this.description = new FormControl('', [
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

