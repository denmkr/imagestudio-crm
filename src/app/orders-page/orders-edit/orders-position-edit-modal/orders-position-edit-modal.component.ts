import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { OrdersPositionEditFormComponent } from './orders-position-edit-form/orders-position-edit-form.component';

@Component({
  selector: 'orders-position-edit-modal',
  templateUrl: './orders-position-edit-modal.component.html',
  styleUrls: ['./orders-position-edit-modal.component.css']
})
export class OrdersPositionEditModalComponent implements OnInit {

  @ViewChild(OrdersPositionEditFormComponent) ordersPositionEditFormComponent: OrdersPositionEditFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();
  @Output() refreshOrderPositions = new EventEmitter<any>();
  @Output() editOrderPosition = new EventEmitter<any>();

  title = "Редактирование продукта в заказе";

  constructor() { }

  ngOnInit() {
  }

  refresh() {
    this.refreshTableEvent.emit(true);
  }

  show() {
  	this.activeClass = true;
  }

  showWithData(position) {
    this.ordersPositionEditFormComponent.updateData(position);
    this.activeClass = true;
  }

  showWithUnsavedData(position) {
    this.ordersPositionEditFormComponent.updateUnsavedData(position);
    this.activeClass = true;
  }

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.ordersPositionEditFormComponent.editOrdersPositionForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

  editPosition(event) {
  	this.editOrderPosition.emit(event);
    this.activeClass = false;
    this.ordersPositionEditFormComponent.position_items = [];
    let timeoutClear = setTimeout(() => { this.ordersPositionEditFormComponent.editOrdersPositionForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

  refreshPositions(event) {
    this.refreshOrderPositions.emit(event);
    this.activeClass = false;
    this.ordersPositionEditFormComponent.position_items = [];
    let timeoutClear = setTimeout(() => { this.ordersPositionEditFormComponent.editOrdersPositionForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

}
