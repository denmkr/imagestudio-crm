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

  public available_events = [{ id: "approve", name: "Оплачено"}];

  public statusSelect = {items: "statuses", name: "status", placeholder: "Статус", id: "statusSelect"};
  public statuses = [{id: "approve", name: "Оплачено"}];

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
    if (event.id == "approve") this.documentsService.approveDocument(id).subscribe(approveResult => {
      this.documentsService.getDocumentsByParams(this.currentCategory, this.currentContact, this.currentSearch, "1").subscribe(result => { this.statusForm.reset(); this.documents = result[0]; this.documentsTablePaginationComponent.paginator = result[1];  });
    });
    
  }

  refreshDocuments() {
    if (this.currentPage === null || this.currentPage === undefined || this.currentPage === "") this.currentPage = "1";
    this.documentsService.getDocumentsByParams(this.currentCategory, this.currentContact, this.currentSearch, this.currentPage).subscribe(result => { this.documents = result[0]; this.documentsTablePaginationComponent.paginator = result[1];  });
  }

  showDocumentsByPage(page: number) {
    this.documentsService.getDocumentsByParams(this.currentCategory, this.currentContact, this.currentSearch, page.toString()).subscribe(
      result => { 
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