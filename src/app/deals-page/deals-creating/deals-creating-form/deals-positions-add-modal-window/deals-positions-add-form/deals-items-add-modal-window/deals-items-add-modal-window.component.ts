import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { DealsItemsAddFormComponent } from './deals-items-add-form/deals-items-add-form.component';

@Component({
  selector: 'deals-items-add-modal-window',
  templateUrl: './deals-items-add-modal-window.component.html',
  styleUrls: ['./deals-items-add-modal-window.component.css']
})
export class DealsItemsAddModalWindowComponent implements OnInit {

  @ViewChild(DealsItemsAddFormComponent) dealsItemsAddFormComponent: DealsItemsAddFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();

  title = "Добавление товара";

  constructor() { }

  ngOnInit() {
  }

  refresh() {
    this.refreshTableEvent.emit(true);
  }

  show() {
  	this.activeClass = true;
  }

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.dealsItemsAddFormComponent.newDealsItemForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

}
