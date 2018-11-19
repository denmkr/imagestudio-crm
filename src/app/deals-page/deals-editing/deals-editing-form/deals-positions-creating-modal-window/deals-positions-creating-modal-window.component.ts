import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { DealsPositionsCreatingFormComponent } from './deals-positions-creating-form/deals-positions-creating-form.component';

@Component({
  selector: 'deals-positions-creating-modal-window',
  templateUrl: './deals-positions-creating-modal-window.component.html',
  styleUrls: ['./deals-positions-creating-modal-window.component.css']
})
export class DealsPositionsCreatingModalWindowComponent implements OnInit {

  @ViewChild(DealsPositionsCreatingFormComponent) dealsPositionsCreatingFormComponent: DealsPositionsCreatingFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();
  @Output() refreshOrderPositions = new EventEmitter<any>();

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
    let timeoutClear = setTimeout(() => { this.dealsPositionsCreatingFormComponent.newDealsPositionForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

  refreshPositions(event) {
    this.refreshOrderPositions.emit(event);
    this.activeClass = false;
    this.dealsPositionsCreatingFormComponent.position_items = [];
    let timeoutClear = setTimeout(() => { this.dealsPositionsCreatingFormComponent.newDealsPositionForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

}
