import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Output, ElementRef, Renderer, HostListener, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators'

@Component({
  selector: 'deals-items-add-form',
  templateUrl: './deals-items-add-form.component.html',
  styleUrls: ['./deals-items-add-form.component.css']
})
export class DealsItemsAddFormComponent implements OnInit {

  @HostBinding('class.active') activeClass: boolean = false;
  @HostBinding('class.validation') validationClass: boolean = false;
  loading = false;
  smallWindow = true;

  public selectInputs = [
  	{name: "product", placeholder: "Выберите товар", title: "Товар", items: "products", id: "productsSelect"},
    {name: "organization", placeholder: "ИП Пупина Александра Владимировича", title: "Организация", items: "organizations", id: "organizationsSelect"}
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

  @Output() eventEmitter = new EventEmitter<boolean>();
  @Output() refreshTableEvent = new EventEmitter<boolean>();

  hideWindow() {
    this.validationClass = false;
    this.eventEmitter.emit(true);
  }

  addDealsItems() {
  	console.log("ADD");
  }

  constructor(public formbuilder: FormBuilder, private elRef: ElementRef, private renderer: Renderer, private cd: ChangeDetectorRef) { }

  ngOnInit() {

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

