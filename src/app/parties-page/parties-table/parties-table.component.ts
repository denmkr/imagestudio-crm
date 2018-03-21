import { Component, Input } from '@angular/core';
import { PartiesService } from '../parties.service';

@Component({
  selector: 'parties-table',
  templateUrl: './parties-table.component.html',
  styleUrls: ['./parties-table.component.css'],
  providers: [PartiesService]
})

export class PartiesTableComponent {
  parties = [];

  constructor(private partiesService: PartiesService) { }

  ngOnInit() {
    this.partiesService.getAllParties().subscribe(parties => { this.parties = parties });
  }

  showClientsParties() {
    this.partiesService.getClientsParties().subscribe(parties => { this.parties = parties });
  }

  showPartnersParties() {
    this.partiesService.getPartnersParties().subscribe(parties => { this.parties = parties });
  }
}