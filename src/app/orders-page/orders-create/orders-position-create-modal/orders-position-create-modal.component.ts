import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { OrdersPositionCreateFormComponent } from './orders-position-create-form/orders-position-create-form.component';

@Component({
  selector: 'orders-position-create-modal',
  templateUrl: './orders-position-create-modal.component.html',
  styleUrls: ['./orders-position-create-modal.component.css']
})
export class OrdersPositionCreateModalComponent implements OnInit {

  @ViewChild(OrdersPositionCreateFormComponent) ordersPositionsAddFormComponent: OrdersPositionCreateFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();
  @Output() refreshOrderPositions = new EventEmitter<any>();

  title = "Создание нового продукта в заказ";

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
    let timeoutClear = setTimeout(() => { this.ordersPositionsAddFormComponent.newOrdersPositionForm.reset(); this.ordersPositionsAddFormComponent.currentDate = new Date(); clearTimeout(timeoutClear); }, 300);
  }

  refreshPositions(event) {
    this.refreshOrderPositions.emit(event);
    this.activeClass = false;
    this.ordersPositionsAddFormComponent.position_items = [];
    let timeoutClear = setTimeout(() => { this.ordersPositionsAddFormComponent.newOrdersPositionForm.reset(); this.ordersPositionsAddFormComponent.currentDate = new Date(); clearTimeout(timeoutClear); }, 300);
  }

}
