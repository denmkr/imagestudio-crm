import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
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

  title = "Контрагенты";
  constructor() { }
  ngOnInit() { }

  updateTableBySearch(search: string) {
    this.partiesTableComponent.showPartiesBySearch(search);
  }

  showModal() {
    this.addModalWindowComponent.show();
  }

  showClients() {
    if (!this.clientsActive) {
      this.partiesTableComponent.showClientsParties();
      this.clientsActive = true;
      this.partnersActive = false;
    }
    else {
      this.partiesTableComponent.showAllParties();
      this.clientsActive = false;
      this.partnersActive = false;
    }
  }

  showPartners() {
    if (!this.partnersActive) {
      this.partiesTableComponent.showPartnersParties();
      this.partnersActive = true;
      this.clientsActive = false;
    }
    else {
      this.partiesTableComponent.showAllParties();
      this.clientsActive = false;
      this.partnersActive = false;
    }
  }

}
