import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { DesignItemsAddFormComponent } from './design-items-add-form/design-items-add-form.component';

@Component({
  selector: 'design-items-add-modal-window',
  templateUrl: './design-items-add-modal-window.component.html',
  styleUrls: ['./design-items-add-modal-window.component.css']
})
export class DesignItemsAddModalWindowComponent implements OnInit {

  @ViewChild(DesignItemsAddFormComponent) designItemsAddFormComponent: DesignItemsAddFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();

  title = "Добавление товара";

  constructor() { }

  ngOnInit() {
  }

  refresh() {
    this.refreshTableEvent.emit(true);
  }

  show() {
  	this.activeClass = true;
  }

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.designItemsAddFormComponent.newDealsItemForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

}
