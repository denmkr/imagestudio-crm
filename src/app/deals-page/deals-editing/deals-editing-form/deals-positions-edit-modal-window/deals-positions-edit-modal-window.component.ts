import { Component, OnInit, HostBinding, ViewChild, EventEmitter, Output } from '@angular/core';
import { DealsPositionsEditFormComponent } from './deals-positions-edit-form/deals-positions-edit-form.component';

@Component({
  selector: 'deals-positions-edit-modal-window',
  templateUrl: './deals-positions-edit-modal-window.component.html',
  styleUrls: ['./deals-positions-edit-modal-window.component.css']
})
export class DealsPositionsEditModalWindowComponent implements OnInit {

  @ViewChild(DealsPositionsEditFormComponent) dealsPositionsEditFormComponent: DealsPositionsEditFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();
  @Output() refreshOrderPositions = new EventEmitter<any>();

  title = "Редактирование продукта в заказе";

  constructor() { }

  ngOnInit() {
  }

  refresh() {
    this.refreshTableEvent.emit(true);
  }

  show() {
  	this.activeClass = true;
  }

  showWithData(position) {
    this.dealsPositionsEditFormComponent.updateData(position);
    this.activeClass = true;
  }

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.dealsPositionsEditFormComponent.newDealsPositionForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

  refreshPositions(event) {
    this.refreshOrderPositions.emit(event);
    this.activeClass = false;
    this.dealsPositionsEditFormComponent.position_items = [];
    let timeoutClear = setTimeout(() => { this.dealsPositionsEditFormComponent.newDealsPositionForm.reset(); clearTimeout(timeoutClear); }, 300);
  }

}
