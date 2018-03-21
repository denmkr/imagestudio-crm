import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { PartiesAddModalWindowComponent } from './parties-add-modal-window/parties-add-modal-window.component';
import { PartiesTableComponent } from './parties-table/parties-table.component';

@Component({
  selector: 'app-parties-page',
  templateUrl: './parties-page.component.html',
  styleUrls: ['./parties-page.component.css']
})

export class PartiesPageComponent implements OnInit {
  @ViewChild(PartiesAddModalWindowComponent) addModalWindowComponent: PartiesAddModalWindowComponent;
  @ViewChild(PartiesTableComponent) partiesTableComponent: PartiesTableComponent;

  @HostBinding('class.active') 
  partnersActive: boolean = false;
  clientsActive: boolean = false;

  title = "Контрагенты";
  constructor() { }
  ngOnInit() { }

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
