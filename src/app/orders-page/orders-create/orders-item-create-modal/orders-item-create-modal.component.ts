import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { OrdersItemCreateFormComponent } from './orders-item-create-form/orders-item-create-form.component';

@Component({
  selector: 'orders-item-create-modal',
  templateUrl: './orders-item-create-modal.component.html',
  styleUrls: ['./orders-item-create-modal.component.css']
})
export class OrdersItemCreateModalComponent implements OnInit {

  @ViewChild(OrdersItemCreateFormComponent) ordersItemCreateFormComponent: OrdersItemCreateFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();
  @Output() refreshOrderItems = new EventEmitter<any>();

  title = "Добавление услуги";

  constructor() { }

  ngOnInit() {
  }

  refresh() {
    this.refreshTableEvent.emit(true);
  }

  show() {
  	this.activeClass = true;
  }

  showForPosition(id: number) {
    this.ordersItemCreateFormComponent.position_id = id;
    this.activeClass = true;
  }  

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.ordersItemCreateFormComponent.newOrdersItemForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

  refreshPositionItems(event) {
    this.refreshOrderItems.emit(event);
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.ordersItemCreateFormComponent.newOrdersItemForm.reset(); this.ordersItemCreateFormComponent.documents = []; clearTimeout(timeoutClear); }, 300);
  }

}
