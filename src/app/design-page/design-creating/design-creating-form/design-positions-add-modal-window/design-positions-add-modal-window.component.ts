import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { DesignPositionsAddFormComponent } from './design-positions-add-form/design-positions-add-form.component';

@Component({
  selector: 'design-positions-add-modal-window',
  templateUrl: './design-positions-add-modal-window.component.html',
  styleUrls: ['./design-positions-add-modal-window.component.css']
})
export class DesignPositionsAddModalWindowComponent implements OnInit {

  @ViewChild(DesignPositionsAddFormComponent) designPositionsAddFormComponent: DesignPositionsAddFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();

  title = "Создание нового продукта в заказ";

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
    let timeoutClear = setTimeout(() => { this.designPositionsAddFormComponent.newDealsPositionForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

}
