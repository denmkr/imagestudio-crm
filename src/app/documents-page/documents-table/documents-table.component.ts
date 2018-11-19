import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
  currentCategory: string;
  currentContact: string;
  currentSearch: string;
  currentPage: string;

  selectedId = 'Лид';

  statusForm: FormGroup;
  status: FormControl;

  public statusSelect = {items: "statuses", name: "status", placeholder: "Статус", id: "statusSelect"};

  constructor(private documentsService: DocumentsService, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(params => {
        this.currentCategory = params['category'];
        this.currentContact = params['contact'];
        this.currentSearch = params['search'];
        this.currentPage = params['page'];
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

    this.status = new FormControl('', [
      Validators.required
    ]);

    this.statusForm = new FormGroup({
      status: this.status
    });

    this.statusForm.reset();
  }

  changeDocumentStatus(id, event) {
    this.documentsService.updateDocumentStatusByDocumentId(event, id);
  }

  refreshDocuments() {
    if (this.currentPage === null || this.currentPage === undefined || this.currentPage === "") this.currentPage = "1";
    this.documentsService.getDocumentsByParams(this.currentCategory, this.currentContact, this.currentSearch, this.currentPage).subscribe(result => { this.documents = result[0]; this.documentsTablePaginationComponent.paginator = result[1];  });
  }

  showDocumentsByPage(page: number) {
    this.documentsService.getDocumentsByParams(this.currentCategory, this.currentContact, this.currentSearch, page.toString()).subscribe(
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
    this.documentsService.getDocumentsByParams(this.currentCategory, this.currentContact, this.currentSearch, "1").subscribe(result => { this.documents = result[0]; this.documentsTablePaginationComponent.paginator = result[1];  });
  }

  showDocumentsByCategory(category: string) {
    this.documentsService.getDocumentsByParams(category, this.currentContact, this.currentSearch, "1").subscribe(result => { this.documents = result[0]; this.documentsTablePaginationComponent.paginator = result[1];  });
  }

  showDocumentsByFilterForm(formGroup: FormGroup) {
    this.documentsService.getDocumentsByParams(this.currentCategory, this.currentContact, formGroup.get("search").value, "1").subscribe(result => { this.documents = result[0]; this.documentsTablePaginationComponent.paginator = result[1];  });
  }
}