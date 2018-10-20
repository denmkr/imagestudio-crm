import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { DocumentsEditFormComponent } from './documents-edit-form/documents-edit-form.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'documents-edit-modal-window',
  templateUrl: './documents-edit-modal-window.component.html',
  styleUrls: ['./documents-edit-modal-window.component.css']
})
export class DocumentsEditModalWindowComponent implements OnInit {

  @ViewChild(DocumentsEditFormComponent) documentsEditFormComponent: DocumentsEditFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();

  title = "Редактировать документ";

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  refresh() {
    this.refreshTableEvent.emit(true);
  }

  show(document) {
    //if (document.author_id === this.authService.getUserId()) {
      this.activeClass = true;
      this.documentsEditFormComponent.updateValues(document);
    //}
  }

  hide() {
    this.activeClass = false;
    this.documentsEditFormComponent.partiesAddModalWindowComponent.hide();
    let timeoutClear = setTimeout(() => { this.documentsEditFormComponent.editDocumentForm.reset(); clearTimeout(timeoutClear); }, 300);
  }
  
}
