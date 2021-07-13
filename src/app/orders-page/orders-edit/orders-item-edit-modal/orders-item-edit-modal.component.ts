import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { OrdersItemEditFormComponent } from './orders-item-edit-form/orders-item-edit-form.component';

@Component({
  selector: 'orders-item-edit-modal',
  templateUrl: './orders-item-edit-modal.component.html',
  styleUrls: ['./orders-item-edit-modal.component.css']
})
export class OrdersItemEditModalComponent implements OnInit {

  @ViewChild(OrdersItemEditFormComponent) ordersItemEditFormComponent: OrdersItemEditFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();
  @Output() refreshOrderItemsEdit = new EventEmitter<any>();
  @Output() refreshOrderItemsRemove = new EventEmitter<any>();

  title = "Редактирование услуги";

  constructor() { }

  ngOnInit() {
  }

  refresh() {
    this.refreshTableEvent.emit(true);
  }

  show() {
  	this.activeClass = true;
  }

  showWithData(item, positionId) {
    this.ordersItemEditFormComponent.updateData(item, positionId);
    this.activeClass = true;
  }

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.ordersItemEditFormComponent.newOrdersItemForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

  refreshPositionItemsRemove(event) {
    this.refreshOrderItemsRemove.emit(true);
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.ordersItemEditFormComponent.newOrdersItemForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

  refreshPositionItems(event) {
    this.refreshOrderItemsEdit.emit(true);
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.ordersItemEditFormComponent.newOrdersItemForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

}
