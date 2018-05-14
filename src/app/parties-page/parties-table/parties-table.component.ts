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
  meta = [];
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

  showPartiesOnPage(page: number) {
    this.partiesService.getPartiesByParams(this.currentType, this.currentCategory, this.currentContact, this.currentSearch, page.toString()).subscribe(
      result => { 
        /*
        if (result[1].current_page > 1) this.meta.push({ 'page': result[1].prev_page, 'text': '<' });
        this.meta.push({ 'page': result[1].next_page, 'text': result[1].next_page });
        this.meta.push({ 'page': result[1].next_page, 'text': '' });
        if (result[1].total_pages < 4) this.meta.push({ 'page': result[1].prev_page, 'text': '<' });
        this.meta.push({ 'number': 2, 'type': 'test' });
        */
        this.parties = result[0]; 
        this.meta = result[1]; 
      }
    );
  }

  showAllParties() {
    this.partiesService.getPartiesByParams(this.currentType, this.currentCategory, this.currentContact, this.currentSearch, "1").subscribe(result => { this.parties = result[0]; this.meta = result[1]; });
  }

  showPartiesByType(type: string) {
    this.partiesService.getPartiesByParams(type, this.currentCategory, this.currentContact, this.currentSearch, "1").subscribe(result => { this.parties = result[0]; this.meta = result[1]; });
  }

  showPartiesByFilterForm(formGroup: FormGroup) {
    this.partiesService.getPartiesByParams(this.currentType, formGroup.get("category").value, this.currentContact, formGroup.get("search").value, "1").subscribe(result => { this.parties = result[0]; this.meta = result[1]; });
  }
}