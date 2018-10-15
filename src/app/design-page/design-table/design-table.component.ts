import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Route, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { DesignService } from '../design.service';
import { DesignTablePaginationComponent } from './design-table-pagination/design-table-pagination.component';

@Component({
  selector: 'design-table',
  templateUrl: './design-table.component.html',
  styleUrls: ['./design-table.component.css'],
  providers: [DesignService]
})

export class DesignTableComponent {
  @ViewChild(DesignTablePaginationComponent) designTablePaginationComponent: DesignTablePaginationComponent;
  @Output() eventEmitter = new EventEmitter<any>();

  deals = [];
  currentStatus: string;
  currentSearch: string;
  currentUserId: string;

  selectedId = 'Лид';

  statusForm: FormGroup;
  status: FormControl;

  public statusSelect = {items: "statuses", name: "status", placeholder: "Статус", id: "statusSelect"};

  public statuses = [
    {text: 'Новое', id: 'new'}, 
    {text: 'Лид', id: 'lead'},
    {text: 'В работе', id: 'work'},
    {text: 'Долг', id: 'debt'},
    {text: 'Сделано', id: 'done'},
    {text: 'Слив', id: 'dumb'}
  ];

  constructor(private designService: DesignService, private activatedRoute: ActivatedRoute, private authService: AuthService) { 
    this.activatedRoute.queryParams.subscribe(params => {
        this.currentStatus = params['status'];
        this.currentSearch = params['search'];
        this.currentUserId = params['author'];
    });
  }

  showEditModal(document) {
    this.eventEmitter.emit(document);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.currentUserId == "user") this.currentUserId = this.authService.getUserId();
      else this.currentUserId = null;

      if (params['page'] != null && params['page'] != undefined) {
        this.showDealsByPage(params['page']);
      }
      else this.showAllDeals();
    });

    this.status = new FormControl('', [
      Validators.required
    ]);

    this.statusForm = new FormGroup({
      status: this.status
    });

    this.statusForm.reset();
  }

  showDealsByPage(page: number) {
    this.designService.getDealsByParams(this.currentStatus, this.currentSearch, page.toString(), this.currentUserId).subscribe(
      result => { 
        this.deals = result[0]; 
        this.designTablePaginationComponent.paginator = result[1]; 
      }
    );
  }

  changeDealStatus(id, event) {
    this.designService.updateDealStatusByOrderId(event, id);
  }

  changePositionStatus(id, event) {
    this.designService.updatePositionStatusByOrderId(event, id);
  }

  revealDeal(event) {
    let id = event.target.parentNode.parentNode.id;
    if (document.getElementById('child' + id).classList.contains('show')) {
      document.getElementById('child' + id).classList.remove("show");
      event.target.classList.remove("active");
    }
    else {
      document.getElementById('child' + id).classList.add("show");
      event.target.classList.add("active");
    }
  }

  showAllDeals() {
    this.designService.getDealsByParams(this.currentStatus, this.currentSearch, "1", this.currentUserId).subscribe(result => { this.deals = result[0]; this.designTablePaginationComponent.paginator = result[1];  });
  }

  showDealsByPossess(user_id: string) {
  	this.designService.getDealsByParams(this.currentStatus, this.currentSearch, "1", user_id).subscribe(result => { this.deals = result[0]; this.designTablePaginationComponent.paginator = result[1];  });
  }

  showDealsByStatus(status: string) {
    this.designService.getDealsByParams(status, this.currentSearch, "1", this.currentUserId).subscribe(result => { this.deals = result[0]; this.designTablePaginationComponent.paginator = result[1];  });
  }

  showDealsByFilterForm(formGroup: FormGroup) {
    this.designService.getDealsByParams(this.currentStatus, formGroup.get("search").value, "1", this.currentUserId).subscribe(result => { this.deals = result[0]; this.designTablePaginationComponent.paginator = result[1];  });
  }
}