import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Route, ActivatedRoute } from '@angular/router';

import { PartiesService } from '../parties.service';
import { PartiesTablePaginationComponent } from './parties-table-pagination/parties-table-pagination.component';

@Component({
  selector: 'parties-table',
  templateUrl: './parties-table.component.html',
  styleUrls: ['./parties-table.component.css'],
  providers: [PartiesService]
})

export class PartiesTableComponent {
  @ViewChild(PartiesTablePaginationComponent) partiesTablePaginationComponent: PartiesTablePaginationComponent;
  @Output() eventEmitter = new EventEmitter<any>();

  parties = [];
  currentType: string;
  // currentCategory: string;
  currentContact: string;
  currentSearch: string;

  constructor(private partiesService: PartiesService, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(params => {
        this.currentType = params['type'];
        // this.currentCategory = params['category'];
        this.currentContact = params['contact'];
        this.currentSearch = params['search'];
    });
  }

  showEditModal(party) {
    this.eventEmitter.emit(party);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page'] != null && params['page'] != undefined) {
        this.showPartiesByPage(params['page']);
      }
      else this.showAllParties();
    });
  }

  showPartiesByPage(page: number) {
    this.partiesService.getPartiesByParams(this.currentType, this.currentContact, this.currentSearch, page.toString()).subscribe(
      result => { 
        /*
        if (result[1].current_page > 1) this.meta.push({ 'page': result[1].prev_page, 'text': '<' });
        this.meta.push({ 'page': result[1].next_page, 'text': result[1].next_page });
        this.meta.push({ 'page': result[1].next_page, 'text': '' });
        if (result[1].total_pages < 4) this.meta.push({ 'page': result[1].prev_page, 'text': '<' });
        this.meta.push({ 'number': 2, 'type': 'test' });
        */
        this.parties = result[0]; 
        this.partiesTablePaginationComponent.paginator = result[1]; 
      }
    );
  }

  refreshParties() {
    if (params['page'] != null && params['page'] != undefined) page = params['page'];
    else page = 1;
    this.partiesService.getPartiesByParams(this.currentType, this.currentContact, this.currentSearch, page.toString()).subscribe(result => { this.parties = result[0]; this.partiesTablePaginationComponent.paginator = result[1];  });
  }

  showAllParties() {
    this.partiesService.getPartiesByParams(this.currentType, this.currentContact, this.currentSearch, "1").subscribe(result => { this.parties = result[0]; this.partiesTablePaginationComponent.paginator = result[1];  });
  }

  showPartiesByType(type: string) {
    this.partiesService.getPartiesByParams(type, this.currentContact, this.currentSearch, "1").subscribe(result => { this.parties = result[0]; this.partiesTablePaginationComponent.paginator = result[1];  });
  }

  showPartiesByFilterForm(formGroup: FormGroup) {
    this.partiesService.getPartiesByParams(this.currentType, this.currentContact, formGroup.get("search").value, "1").subscribe(result => { this.parties = result[0]; this.partiesTablePaginationComponent.paginator = result[1];  });
  }
}