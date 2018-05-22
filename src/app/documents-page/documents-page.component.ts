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
  partnersActive: boolean = false;
  clientsActive: boolean = false;
  filersActive: boolean = false;

  title = "Документы";

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() { 
    this.activatedRoute.queryParams.subscribe(params => {
        let type = params['type'];
        if (type == "client") this.clientsActive = true;
        if (type == "partner") this.partnersActive = true;
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

  showClients() {
    if (!this.clientsActive) {
      this.documentsTableComponent.showDocumentsByType("client");
      this.clientsActive = true;
      this.partnersActive = false;
      this.router.navigate(['/documents'], { queryParams: { type: "client", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.documentsTableComponent.showDocumentsByType(null);
      this.clientsActive = false;
      this.partnersActive = false;
      this.router.navigate(['/documents'], { queryParams: { type: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showPartners() {
    if (!this.partnersActive) {
      this.documentsTableComponent.showDocumentsByType("partner");
      this.partnersActive = true;
      this.clientsActive = false;
      this.router.navigate(['/documents'], { queryParams: { type: "partner", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.documentsTableComponent.showDocumentsByType(null);
      this.clientsActive = false;
      this.partnersActive = false;
      this.router.navigate(['/documents'], { queryParams: { type: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

}
