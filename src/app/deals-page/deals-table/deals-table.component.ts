import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { DealsService } from '../deals.service';
import { DealsTablePaginationComponent } from './deals-table-pagination/deals-table-pagination.component';

@Component({
  selector: 'deals-table',
  templateUrl: './deals-table.component.html',
  styleUrls: ['./deals-table.component.css'],
  providers: [DealsService]
})

export class DealsTableComponent {
  @ViewChild(DealsTablePaginationComponent) dealsTablePaginationComponent: DealsTablePaginationComponent;
  @Output() eventEmitter = new EventEmitter<any>();

  deals = [];
  currentStatus: string;
  currentSearch: string;
  currentUserId: string;

  statusForm: FormGroup;
  status: FormControl;

  positionStatusForm: FormGroup;
  positionStatus: FormControl;

  editingLink = "/deals/edit";

  public statusSelect = {name: "status", placeholder: "Статус", id: "statusSelect"};
  public positionStatusSelect = {name: "positionStatus", placeholder: "Статус", id: "positionStatusSelect"};

  constructor(private router: Router, private dealsService: DealsService, private activatedRoute: ActivatedRoute, private authService: AuthService) { 
    this.activatedRoute.queryParams.subscribe(params => {
        this.currentStatus = params['status'];
        this.currentSearch = params['search'];
        this.currentUserId = params['author'];
    });
  }

  toEditPage(id, userId) {
    if (this.authService.getUserId() == userId) this.router.navigate(['/deals/edit'], { queryParams: { id: id } });
  }

  showEditModal(deal) {
    console.log(deal);
    // this.eventEmitter.emit(deal);
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

    this.positionStatus = new FormControl('', [
      Validators.required
    ]);

    this.positionStatusForm = new FormGroup({
      positionStatus: this.positionStatus
    });

    this.statusForm.reset();
    this.positionStatusForm.reset();
  }

  showDealsByPage(page: number) {
    this.dealsService.getDealsByParams(this.currentStatus, this.currentSearch, page.toString(), this.currentUserId).subscribe(
      result => { 
        this.deals = result[0]; 
        this.dealsTablePaginationComponent.paginator = result[1]; 
      }
    );
  }

  changeDealStatus(id, event) {
    this.dealsService.updateDealStatusByOrderId(event.id, id).subscribe(
      result => {
        this.statusForm.reset();
        this.showAllDeals();
      }
    );
  }

  changePositionStatus(id, event) {
    this.dealsService.updatePositionStatusByOrderId(event.id, id).subscribe(
      result => {
        this.positionStatusForm.reset();
        this.showAllDeals();
      }
    );
  }

  revealDeal(event) {
    let id = event.target.parentNode.parentNode.id;
    let elements = document.getElementsByClassName('child' + id);

    if (elements) {
      Array.from(elements).forEach(
        function(element, index, array) {
          if (element.classList.contains('show')) {
            element.classList.remove("show");
            event.target.classList.remove("active");
          }
          else {
            element.classList.add("show");
            event.target.classList.add("active");
          }
        }
      );
    }
  }

  showAllDeals() {
    this.dealsService.getDealsByParams(this.currentStatus, this.currentSearch, "1", this.currentUserId).subscribe(result => { this.deals = result[0]; this.dealsTablePaginationComponent.paginator = result[1];  });
  }

  showDealsByPossess(user_id: string) {
  	this.dealsService.getDealsByParams(this.currentStatus, this.currentSearch, "1", user_id).subscribe(result => { this.deals = result[0]; this.dealsTablePaginationComponent.paginator = result[1];  });
  }

  showDealsByStatus(status: string) {
    this.dealsService.getDealsByParams(status, this.currentSearch, "1", this.currentUserId).subscribe(result => { this.deals = result[0]; this.dealsTablePaginationComponent.paginator = result[1];  });
  }

  showDealsByFilterForm(formGroup: FormGroup) {
    this.dealsService.getDealsByParams(this.currentStatus, formGroup.get("search").value, "1", this.currentUserId).subscribe(result => { this.deals = result[0]; this.dealsTablePaginationComponent.paginator = result[1];  });
  }
}