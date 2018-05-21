import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { PartiesEditFormComponent } from './parties-edit-form/parties-edit-form.component';

@Component({
  selector: 'parties-edit-modal-window',
  templateUrl: './parties-edit-modal-window.component.html',
  styleUrls: ['./parties-edit-modal-window.component.css']
})
export class PartiesEditModalWindowComponent implements OnInit {

  @ViewChild(PartiesEditFormComponent) partiesEditFormComponent: PartiesEditFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  title = "Редактировать контрагента";

  constructor() { }

  ngOnInit() {
  }

  show(party) {
  	this.activeClass = true;
    this.partiesEditFormComponent.updateValues(party);
  }

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.partiesEditFormComponent.editPartyForm.reset(); clearTimeout(timeoutClear); }, 300);
  }
  
}
