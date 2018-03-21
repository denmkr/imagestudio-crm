import { Component, OnInit } from '@angular/core';
import { PartiesService } from './parties.service';

@Component({
  selector: 'app-parties-page',
  templateUrl: './parties-page.component.html',
  styleUrls: ['./parties-page.component.css'],
  providers: [PartiesService]

})
export class PartiesPageComponent implements OnInit {

  title = "Контрагенты";
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
