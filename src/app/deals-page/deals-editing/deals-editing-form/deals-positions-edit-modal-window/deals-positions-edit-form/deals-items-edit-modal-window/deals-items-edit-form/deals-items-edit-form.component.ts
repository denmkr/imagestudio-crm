import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { PartiesService } from '../../../../../../../parties-page/parties.service';
import { WarehouseService } from '../../../../../../../warehouse-page/warehouse.service';

@Component({
  selector: 'deals-items-edit-form',
  templateUrl: './deals-items-edit-form.component.html',
  styleUrls: ['./deals-items-edit-form.component.css'],
  providers: [WarehouseService, PartiesService]
})
export class DealsItemsEditFormComponent implements OnInit {

  @HostBinding('class.active') activeClass: boolean = false;
  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;
  smallWindow = true;

  public selectInputs = [
    {name: "product", placeholder: "Выберите товар", title: "Товар", items: "products", id: "productsSelect", typeahead: "productsTypeahead"},
    {name: "organization", placeholder: "ИП Пупина Александра Владимировича", title: "Организация", items: "organizations", id: "organizationsSelect", typeahead: "organizationsTypeahead"}
  ];

  public inputs = [
    {name: "price", type: "text", title: "Стоимость", tiny: true},
  ];

  public organizations = [];
  public products = [];

  newDealsItemForm: FormGroup;

  product: FormControl;
  organization: FormControl;
  price: FormControl;

  @Output() refreshPositionItems = new EventEmitter<any>();
  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  addPositionItems() {
    this.refreshPositionItems.emit(this.newDealsItemForm.value);
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

  addTag(name) {
    return { id: name, text: name };
  }

  ngOnInit() {
    this.serverSideSearchForOrganizations();
    this.serverSideSearchForProducts();

    this.price = new FormControl('', [
      Validators.required
    ]);
    this.product = new FormControl('', [
      Validators.required
    ]);
    this.organization = new FormControl('', [
      Validators.required
    ]);

    this.newDealsItemForm = new FormGroup({
      price: this.price,
      product: this.product,
      organization: this.organization
    });

    this.newDealsItemForm.reset();
  }

}

