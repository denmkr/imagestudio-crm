import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { DocumentsAddModalWindowComponent } from './documents-add-modal-window/documents-add-modal-window.component';
import { DocumentsEditModalWindowComponent } from './documents-edit-modal-window/documents-edit-modal-window.component';
import { DocumentsTableComponent } from './documents-table/documents-table.component';
import { DocumentsSearchComponent } from './documents-search/documents-search.component';

@Component({
  selector: 'app-parties-page',
  templateUrl: './documents-page.component.html',
  styleUrls: ['./documents-page.component.css']
})

export class DocumentsPageComponent implements OnInit {
  @ViewChild(DocumentsAddModalWindowComponent) addModalWindowComponent: DocumentsAddModalWindowComponent;
  @ViewChild(DocumentsEditModalWindowComponent) editModalWindowComponent: DocumentsEditModalWindowComponent;
  @ViewChild(DocumentsTableComponent) documentsTableComponent: DocumentsTableComponent;
  @ViewChild(DocumentsSearchComponent) documentsSearchComponent: DocumentsSearchComponent;

  @HostBinding('class.active')
  incomeActive: boolean = false;
  expenseActive: boolean = false;
  filersActive: boolean = false;

  title = "Документы";

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() { 
    this.activatedRoute.queryParams.subscribe(params => {
        let category = params['category'];
        if (category == "spending") this.expenseActive = true;
        if (category == "income") this.incomeActive = true;
    });
  }

  updateTableByFilterForm(formGroup: FormGroup) {
    this.documentsTableComponent.showDocumentsByFilterForm(formGroup);
  }

  showCreateModal() {
    this.addModalWindowComponent.show();
  }

  showEditModal(party) {
    this.editModalWindowComponent.show(party);
  }

  toggleFilters() {
    this.filersActive = !this.filersActive;
  }

  refreshTable() {
    this.documentsTableComponent.refreshDocuments();
  }
  
  showExpenseDocuments() {
    if (!this.expenseActive) {
      this.documentsTableComponent.showDocumentsByCategory("spending");
      this.expenseActive = true;
      this.incomeActive = false;
      this.router.navigate(['/documents'], { queryParams: { category: "spending", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.documentsTableComponent.showDocumentsByCategory(null);
      this.expenseActive = false;
      this.incomeActive = false;
      this.router.navigate(['/documents'], { queryParams: { category: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showIncomeDocuments() {
    if (!this.incomeActive) {
      this.documentsTableComponent.showDocumentsByCategory("income");
      this.incomeActive = true;
      this.expenseActive = false;
      this.router.navigate(['/documents'], { queryParams: { category: "income", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.documentsTableComponent.showDocumentsByCategory(null);
      this.expenseActive = false;
      this.incomeActive = false;
      this.router.navigate(['/documents'], { queryParams: { category: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

}
