import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { DealsPositionsAddFormComponent } from './deals-positions-add-form/deals-positions-add-form.component';

@Component({
  selector: 'deals-positions-add-modal-window',
  templateUrl: './deals-positions-add-modal-window.component.html',
  styleUrls: ['./deals-positions-add-modal-window.component.css']
})
export class DealsPositionsAddModalWindowComponent implements OnInit {

  @ViewChild(DealsPositionsAddFormComponent) dealsPositionsAddFormComponent: DealsPositionsAddFormComponent;
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
    let timeoutClear = setTimeout(() => { this.dealsPositionsAddFormComponent.newDealsPositionForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

  refreshPositions(event) {
    this.refreshOrderPositions.emit(event);
    this.activeClass = false;
    this.dealsPositionsAddFormComponent.position_items = [];
    let timeoutClear = setTimeout(() => { this.dealsPositionsAddFormComponent.newDealsPositionForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

}
