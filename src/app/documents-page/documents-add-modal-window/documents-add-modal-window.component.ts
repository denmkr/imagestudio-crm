import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
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

  updateOrder(event) {
    this.updateTableInOrder.emit(event);
  }

  hide() {
    this.activeClass = false;
    this.documentsAddFormComponent.partiesAddModalWindowComponent.hide();
    
    let timeoutClear = setTimeout(() => { this.documentsAddFormComponent.resetForm(); clearTimeout(timeoutClear); }, 300);
  }
  
}
