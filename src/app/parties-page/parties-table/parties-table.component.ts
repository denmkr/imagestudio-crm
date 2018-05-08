import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Route, ActivatedRoute } from '@angular/router';

import { PartiesService } from '../parties.service';
import { PartiesEditModalWindowComponent } from '../parties-edit-modal-window/parties-edit-modal-window.component';

@Component({
  selector: 'parties-table',
  templateUrl: './parties-table.component.html',
  styleUrls: ['./parties-table.component.css'],
  providers: [PartiesService]
})

export class PartiesTableComponent {
  @ViewChild(PartiesEditModalWindowComponent) editModalWindowComponent: PartiesEditModalWindowComponent;

  parties = [];
  currentType: string;
  currentCategory: string;
  currentContact: string;
  currentSearch: string;

  constructor(private partiesService: PartiesService, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(params => {
        this.currentType = params['type'];
        this.currentCategory = params['category'];
        this.currentContact = params['contact'];
        this.currentSearch = params['search'];
    });
  }

  showEditModal(party) {
    this.editModalWindowComponent.show(party);
  }

  ngOnInit() {
    this.showAllParties();
  }

  showAllParties() {
    this.partiesService.getPartiesByParams(this.currentType, this.currentCategory, this.currentContact, this.currentSearch).subscribe(parties => { this.parties = parties });
  }

  showPartiesByType(type: string) {
    this.partiesService.getPartiesByParams(type, this.currentCategory, this.currentContact, this.currentSearch).subscribe(parties => { this.parties = parties });
  }

  showPartiesByFilterForm(formGroup: FormGroup) {
    this.partiesService.getPartiesByParams(this.currentType, formGroup.get("category").value, this.currentContact, formGroup.get("search").value).subscribe(parties => { this.parties = parties });
  }
}