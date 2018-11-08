import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { DealsItemsEditFormComponent } from './deals-items-edit-form/deals-items-edit-form.component';

@Component({
  selector: 'deals-items-edit-modal-window',
  templateUrl: './deals-items-edit-modal-window.component.html',
  styleUrls: ['./deals-items-edit-modal-window.component.css']
})
export class DealsItemsEditModalWindowComponent implements OnInit {

  @ViewChild(DealsItemsEditFormComponent) dealsItemsEditFormComponent: DealsItemsEditFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();
  @Output() refreshOrderItems = new EventEmitter<any>();

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
    let timeoutClear = setTimeout(() => { this.dealsItemsEditFormComponent.newDealsItemForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

  refreshPositionItems(event) {
    this.refreshOrderItems.emit(event);
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.dealsItemsEditFormComponent.newDealsItemForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

}
