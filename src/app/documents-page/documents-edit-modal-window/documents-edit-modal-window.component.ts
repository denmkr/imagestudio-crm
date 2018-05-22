import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { DocumentsEditFormComponent } from './documents-edit-form/documents-edit-form.component';

@Component({
  selector: 'documents-edit-modal-window',
  templateUrl: './documents-edit-modal-window.component.html',
  styleUrls: ['./documents-edit-modal-window.component.css']
})
export class DocumentsEditModalWindowComponent implements OnInit {

  @ViewChild(DocumentsEditFormComponent) documentsEditFormComponent: DocumentsEditFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  title = "Редактировать документ";

  constructor() { }

  ngOnInit() {
  }

  show(document) {
  	this.activeClass = true;
    this.documentsEditFormComponent.updateValues(document);
  }

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.documentsEditFormComponent.editDocumentForm.reset(); clearTimeout(timeoutClear); }, 300);
  }
  
}
