import { Component, OnInit, HostBinding, ViewChild, Output, EventEmitter } from '@angular/core';
import { PartiesEditFormComponent } from './parties-edit-form/parties-edit-form.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'parties-edit-modal-window',
  templateUrl: './parties-edit-modal-window.component.html',
  styleUrls: ['./parties-edit-modal-window.component.css']
})
export class PartiesEditModalWindowComponent implements OnInit {

  @ViewChild(PartiesEditFormComponent) partiesEditFormComponent: PartiesEditFormComponent;
  @HostBinding('class.active') activeClass: boolean = false;

  @Output() refreshTableEvent = new EventEmitter<boolean>();

  title = "Редактировать контрагента";

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  refresh() {
    this.refreshTableEvent.emit(true);
  }

  show(party) {
    if (party.author_id === this.authService.getUserId()) {
      this.activeClass = true;
      this.partiesEditFormComponent.updateValues(party);
    }
    else {
      console.log("Нет доступа");
    }
  }

  hide() {
    this.activeClass = false;
    let timeoutClear = setTimeout(() => { this.partiesEditFormComponent.editPartyForm.reset(); clearTimeout(timeoutClear); }, 300);
  }
  
}
