import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Route, ActivatedRoute } from '@angular/router';

import { DocumentsService } from '../documents.service';
import { DocumentsTablePaginationComponent } from './documents-table-pagination/documents-table-pagination.component';

@Component({
  selector: 'documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.css'],
  providers: [DocumentsService]
})

export class DocumentsTableComponent {
  @ViewChild(DocumentsTablePaginationComponent) documentsTablePaginationComponent: DocumentsTablePaginationComponent;
  @Output() eventEmitter = new EventEmitter<any>();

  documents = [];
  currentType: string;
  // currentCategory: string;
  currentContact: string;
  currentSearch: string;

  constructor(private documentsService: DocumentsService, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(params => {
        this.currentType = params['type'];
        this.currentContact = params['contact'];
        this.currentSearch = params['search'];
    });
  }

  showEditModal(document) {
    this.eventEmitter.emit(document);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page'] != null && params['page'] != undefined) {
        this.showDocumentsByPage(params['page']);
      }
      else this.showAllDocuments();
    });
  }

  showDocumentsByPage(page: number) {
    this.documentsService.getDocumentsByParams(this.currentType, this.currentContact, this.currentSearch, page.toString()).subscribe(
      result => { 
        /*
        if (result[1].current_page > 1) this.meta.push({ 'page': result[1].prev_page, 'text': '<' });
        this.meta.push({ 'page': result[1].next_page, 'text': result[1].next_page });
        this.meta.push({ 'page': result[1].next_page, 'text': '' });
        if (result[1].total_pages < 4) this.meta.push({ 'page': result[1].prev_page, 'text': '<' });
        this.meta.push({ 'number': 2, 'type': 'test' });
        */
        this.documents = result[0]; 
        this.documentsTablePaginationComponent.paginator = result[1]; 
      }
    );
  }

  showAllDocuments() {
    this.documentsService.getDocumentsByParams(this.currentType, this.currentContact, this.currentSearch, "1").subscribe(result => { this.documents = result[0]; this.documentsTablePaginationComponent.paginator = result[1];  });
  }

  showDocumentsByType(type: string) {
    this.documentsService.getDocumentsByParams(type, this.currentContact, this.currentSearch, "1").subscribe(result => { this.documents = result[0]; this.documentsTablePaginationComponent.paginator = result[1];  });
  }

  showDocumentsByFilterForm(formGroup: FormGroup) {
    this.documentsService.getDocumentsByParams(this.currentType, this.currentContact, formGroup.get("search").value, "1").subscribe(result => { this.documents = result[0]; this.documentsTablePaginationComponent.paginator = result[1];  });
  }
}