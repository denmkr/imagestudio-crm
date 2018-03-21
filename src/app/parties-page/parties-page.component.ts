import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { PartiesTableComponent } from './parties-table/parties-table.component';

@Component({
  selector: 'app-parties-page',
  templateUrl: './parties-page.component.html',
  styleUrls: ['./parties-page.component.css']
})

export class PartiesPageComponent implements OnInit {
  @ViewChild(PartiesTableComponent) partiesTableComponent: PartiesTableComponent;

  @HostBinding('class.active') 
  partnersActive: boolean = false;
  clientsActive: boolean = false;

  title = "Контрагенты";
  constructor() { }
  ngOnInit() { }

  showClients() {
    this.partiesTableComponent.showClientsParties();
    this.clientsActive = true;
    this.partnersActive = false;
  }

  showPartners() {
    this.partiesTableComponent.showPartnersParties();
    this.partnersActive = true;
    this.clientsActive = false;
  }

}
