import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { PartiesAddFormComponent } from './parties-add-form/parties-add-form.component';

@Component({
  selector: 'parties-add-modal-window',
  templateUrl: './parties-add-modal-window.component.html',
  styleUrls: ['./parties-add-modal-window.component.css']
})
export class PartiesAddModalWindowComponent implements OnInit {

  @ViewChild(PartiesAddFormComponent) partiesAddFormComponent: PartiesAddFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  title = "Новый контрагент";

  constructor() { }

  ngOnInit() {
  }

  show() {
  	this.activeClass = true;
  }

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.partiesAddFormComponent.newPartyForm.reset(); clearTimeout(timeoutClear); }, 300);
  }
  
}
