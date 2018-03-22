import { Component, Input } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';

import { PartiesService } from '../parties.service';

@Component({
  selector: 'parties-table',
  templateUrl: './parties-table.component.html',
  styleUrls: ['./parties-table.component.css'],
  providers: [PartiesService]
})

export class PartiesTableComponent {
  parties = [];
  currentType: string;
  currentOrganization: string;
  currentContact: string;
  currentSearch: string;

  constructor(private partiesService: PartiesService, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(params => {
        this.currentType = params['type'];
        this.currentOrganization = params['organization'];
        this.currentContact = params['contact'];
        this.currentSearch = params['search'];
    });
  }

  ngOnInit() {
    this.showAllParties();
  }

  showAllParties() {
    this.partiesService.getPartiesByParams(this.currentType, this.currentOrganization, this.currentContact, this.currentSearch).subscribe(parties => { this.parties = parties });
  }

  showPartiesByType(type: string) {
    this.partiesService.getPartiesByParams(type, this.currentOrganization, this.currentContact, this.currentSearch).subscribe(parties => { this.parties = parties });
  }

  showPartiesByOgranization(organization: string) {
    this.partiesService.getPartiesByParams(this.currentType, organization, this.currentContact, this.currentSearch).subscribe(parties => { this.parties = parties });
  }

  showPartiesByContact(contact: string) {
    this.partiesService.getPartiesByParams(this.currentType, this.currentOrganization, contact, this.currentSearch).subscribe(parties => { this.parties = parties });
  }

  showPartiesBySearch(search: string) {
    this.partiesService.getPartiesByParams(this.currentType, this.currentOrganization, this.currentContact, search).subscribe(parties => { this.parties = parties });
  }
}