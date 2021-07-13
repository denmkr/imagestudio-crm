import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { DocumentsAddFormComponent } from './documents-add-form/documents-add-form.component';

@Component({
  selector: 'documents-add-modal-window',
  templateUrl: './documents-add-modal-window.component.html',
  styleUrls: ['./documents-add-modal-window.component.css']
})
export class DocumentsAddModalWindowComponent implements OnInit {

  @ViewChild(DocumentsAddFormComponent) documentsAddFormComponent: DocumentsAddFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();
  @Output() updateTableInOrder = new EventEmitter<any>();
  @Output() updateTableInItem = new EventEmitter<any>();

  title = "Новый документ";

  constructor() { }

  ngOnInit() {
  }

  refresh() {
    this.refreshTableEvent.emit(true);
  }

  show() {
  	this.activeClass = true;
  }

  showForOrder() {
    this.documentsAddFormComponent.forOrder();
    this.activeClass = true;
  }

  showForItemReceipt(organizationId) {
    this.documentsAddFormComponent.forItemReceipt(organizationId);
    this.title = "Новый счет";
    this.activeClass = true;
  }

  showForItemTemplate(organizationId) {
    this.documentsAddFormComponent.forItemTemplate(organizationId);
    this.title = "Новый макет";
    this.activeClass = true;
  }

  updateOrder(event) {
    this.updateTableInOrder.emit(event);
  }

  updateItem(event) {
    this.updateTableInItem.emit(event);
  }

  hide() {
    this.activeClass = false;
    this.documentsAddFormComponent.partiesAddModalWindowComponent.hide();
    
    let timeoutClear = setTimeout(() => { this.documentsAddFormComponent.resetForm(); clearTimeout(timeoutClear); }, 300);
  }
  
}
