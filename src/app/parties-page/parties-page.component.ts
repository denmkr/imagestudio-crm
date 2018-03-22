import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import { PartiesAddModalWindowComponent } from './parties-add-modal-window/parties-add-modal-window.component';
import { PartiesTableComponent } from './parties-table/parties-table.component';
import { PartiesSearchComponent } from './parties-search/parties-search.component';

@Component({
  selector: 'app-parties-page',
  templateUrl: './parties-page.component.html',
  styleUrls: ['./parties-page.component.css']
})

export class PartiesPageComponent implements OnInit {
  @ViewChild(PartiesAddModalWindowComponent) addModalWindowComponent: PartiesAddModalWindowComponent;
  @ViewChild(PartiesTableComponent) partiesTableComponent: PartiesTableComponent;
  @ViewChild(PartiesSearchComponent) partiesSearchComponent: PartiesSearchComponent;

  @HostBinding('class.active') 
  partnersActive: boolean = false;
  clientsActive: boolean = false;
  filersActive: boolean = false;

  title = "Контрагенты";
  constructor(private router: Router) { }
  ngOnInit() { }

  updateTableBySearch(search: string) {
    this.partiesTableComponent.showPartiesBySearch(search);
  }

  showModal() {
    this.addModalWindowComponent.show();
  }

  toggleFilters() {
    this.filersActive = !this.filersActive;
  }

  showClients() {
    if (!this.clientsActive) {
      this.partiesTableComponent.showPartiesByType("client");
      this.clientsActive = true;
      this.partnersActive = false;
      this.router.navigate(['/parties'], { queryParams: { type: "client"}, queryParamsHandling: 'merge' });
    }
    else {
      this.partiesTableComponent.showPartiesByType("");
      this.clientsActive = false;
      this.partnersActive = false;
      this.router.navigate(['/parties'], { queryParams: { type: null}, queryParamsHandling: 'merge' });
    }
  }

  showPartners() {
    if (!this.partnersActive) {
      this.partiesTableComponent.showPartiesByType("partner");
      this.partnersActive = true;
      this.clientsActive = false;
      this.router.navigate(['/parties'], { queryParams: { type: "partner"}, queryParamsHandling: 'merge' });
    }
    else {
      this.partiesTableComponent.showPartiesByType("");
      this.clientsActive = false;
      this.partnersActive = false;
      this.router.navigate(['/parties'], { queryParams: { type: null}, queryParamsHandling: 'merge' });
    }
  }

}
