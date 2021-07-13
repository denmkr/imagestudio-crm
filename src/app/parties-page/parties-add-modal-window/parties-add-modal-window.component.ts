import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { PartiesAddFormComponent } from './parties-add-form/parties-add-form.component';

@Component({
  selector: 'parties-add-modal-window',
  templateUrl: './parties-add-modal-window.component.html',
  styleUrls: ['./parties-add-modal-window.component.css']
})
export class PartiesAddModalWindowComponent implements OnInit {

  @ViewChild(PartiesAddFormComponent) partiesAddFormComponent: PartiesAddFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();
  @Output() updateOrganization = new EventEmitter<any>();

  title = "Новый контрагент";

  constructor() { }

  ngOnInit() {
  }

  refresh() {
    this.refreshTableEvent.emit(true);
  }

  show() {
  	this.activeClass = true;
  }

  sendOrganization(event) {
    this.updateOrganization.emit(event);
  }

  showWithName(name) {
    this.partiesAddFormComponent.setName(name);
    this.activeClass = true;
  }

  showWithOrganization(name) {
    this.partiesAddFormComponent.setOrganization(name);
    this.activeClass = true;
  }

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.partiesAddFormComponent.newPartyForm.reset(); clearTimeout(timeoutClear); }, 300);
  }
  
}
