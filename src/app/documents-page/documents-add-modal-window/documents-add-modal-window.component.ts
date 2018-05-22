import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { DocumentsAddFormComponent } from './documents-add-form/documents-add-form.component';

@Component({
  selector: 'documents-add-modal-window',
  templateUrl: './documents-add-modal-window.component.html',
  styleUrls: ['./documents-add-modal-window.component.css']
})
export class DocumentsAddModalWindowComponent implements OnInit {

  @ViewChild(DocumentsAddFormComponent) documentsAddFormComponent: DocumentsAddFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  title = "Новый документ №3424";

  constructor() { }

  ngOnInit() {
  }

  show() {
  	this.activeClass = true;
  }

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.documentsAddFormComponent.newDocumentForm.reset(); clearTimeout(timeoutClear); }, 300);
  }
  
}
