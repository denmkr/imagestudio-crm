import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { PartiesAddModalWindowComponent } from './parties-add-modal-window/parties-add-modal-window.component';
import { PartiesEditModalWindowComponent } from './parties-edit-modal-window/parties-edit-modal-window.component';
import { PartiesTableComponent } from './parties-table/parties-table.component';
import { PartiesSearchComponent } from './parties-search/parties-search.component';

@Component({
  selector: 'app-parties-page',
  templateUrl: './parties-page.component.html',
  styleUrls: ['./parties-page.component.css']
})

export class PartiesPageComponent implements OnInit {
  @ViewChild(PartiesAddModalWindowComponent) addModalWindowComponent: PartiesAddModalWindowComponent;
  @ViewChild(PartiesEditModalWindowComponent) editModalWindowComponent: PartiesEditModalWindowComponent;
  @ViewChild(PartiesTableComponent) partiesTableComponent: PartiesTableComponent;
  @ViewChild(PartiesSearchComponent) partiesSearchComponent: PartiesSearchComponent;

  @HostBinding('class.active')
  partnersActive: boolean = false;
  clientsActive: boolean = false;
  filersActive: boolean = false;

  title = "Контрагенты";

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() { 
    this.activatedRoute.queryParams.subscribe(params => {
        let type = params['type'];
        if (type == "client") this.clientsActive = true;
        if (type == "partner") this.partnersActive = true;
    });
  }

  updateTableByFilterForm(formGroup: FormGroup) {
    this.partiesTableComponent.showPartiesByFilterForm(formGroup);
  }

  showCreateModal() {
    this.addModalWindowComponent.show();
  }

  refreshTable() {
    this.partiesTableComponent.refreshParties();
  }

  showEditModal(party) {
    this.editModalWindowComponent.show(party);
  }

  toggleFilters() {
    this.filersActive = !this.filersActive;
  }

  showClients() {
    if (!this.clientsActive) {
      this.partiesTableComponent.showPartiesByType("client");
      this.clientsActive = true;
      this.partnersActive = false;
      this.router.navigate(['/parties'], { queryParams: { type: "client", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.partiesTableComponent.showPartiesByType(null);
      this.clientsActive = false;
      this.partnersActive = false;
      this.router.navigate(['/parties'], { queryParams: { type: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showPartners() {
    if (!this.partnersActive) {
      this.partiesTableComponent.showPartiesByType("partner");
      this.partnersActive = true;
      this.clientsActive = false;
      this.router.navigate(['/parties'], { queryParams: { type: "partner", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.partiesTableComponent.showPartiesByType(null);
      this.clientsActive = false;
      this.partnersActive = false;
      this.router.navigate(['/parties'], { queryParams: { type: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

}
