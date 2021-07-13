import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormGroup } from '@angular/forms';

import { OrdersColumnsComponent } from './orders-columns/orders-columns.component';
import { OrdersTableComponent } from './orders-table/orders-table.component';
import { OrdersSearchComponent } from './orders-search/orders-search.component';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})

export class OrdersPageComponent implements OnInit {
  @ViewChild(OrdersTableComponent) ordersTableComponent: OrdersTableComponent;
  @ViewChild(OrdersColumnsComponent) ordersColumnsComponent: OrdersColumnsComponent;
  @ViewChild(OrdersSearchComponent) ordersSearchComponent: OrdersSearchComponent;

  @HostBinding('class.active')
  noneActive: boolean = false;
  newActive: boolean = false;
  leadActive: boolean = false;
  inProgressActive: boolean = false;
  doneActive: boolean = false;
  payedActive: boolean = false;
  deniedActive: boolean = false;
  filersActive: boolean = false;

  mineActive: boolean = false;
  allActive: boolean = false;

  columnsMode: boolean = false;

  title = "Сделки";
  creatingLink = "/orders/create";

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() { 
    this.activatedRoute.queryParams.subscribe(params => {
        if (params['author'] == "user") this.mineActive = true;
        else this.allActive = true;

        let status = params['status'];
        if (status == null) this.noneActive = true;
        if (status == "new") this.newActive = true;
        if (status == "lead") this.leadActive = true;
        if (status == "in_progress") this.inProgressActive = true;
        if (status == "done") this.doneActive = true;
        if (status == "payed") this.payedActive = true;
        if (status == "denied") this.deniedActive = true;

        if (localStorage.getItem('mode') == "columns") this.columnsMode = true;
    });
  }

  updateTableByFilterForm(formGroup: FormGroup) {
    if (this.columnsMode) this.ordersColumnsComponent.showOrdersByFilterForm(formGroup);
    else this.ordersTableComponent.showOrdersByFilterForm(formGroup);
  }

  toggleFilters() {
    this.filersActive = !this.filersActive;
  }

  setColumnsMode() {
    this.columnsMode = true;
    localStorage.setItem('mode', 'columns'); 
  }

  setTableMode() {
    this.columnsMode = false;
    localStorage.setItem('mode', 'table'); 
  }

  showMyOrders() {
    if (!this.mineActive) {
      if (this.columnsMode) this.ordersColumnsComponent.showOrdersByPossess(this.authService.getUserId());
      else this.ordersTableComponent.showOrdersByPossess(this.authService.getUserId());
      this.mineActive = true;
      this.allActive = false;
      this.router.navigate(['/orders'], { queryParams: { author: "user", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      if (this.columnsMode) this.ordersColumnsComponent.showOrdersByPossess(null);
      else this.ordersTableComponent.showOrdersByPossess(null);
      this.mineActive = false;
      this.allActive = false;
      this.router.navigate(['/orders'], { queryParams: { author: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showAllOrders() {
    if (this.columnsMode) this.ordersColumnsComponent.showOrdersByPossess(null);
    else this.ordersTableComponent.showOrdersByPossess(null);

    this.newActive = false;
    this.leadActive = false;
    this.inProgressActive = false;
    this.doneActive = false;
    this.payedActive = false;
    this.deniedActive = false;
    this.noneActive = true;

    if (!this.allActive) {
      this.mineActive = false;
      this.allActive = true;
    }
    else {
      this.mineActive = false;
      this.allActive = false;
    }

    this.ordersTableComponent.showOrdersByStatus(null);
    this.router.navigate(['/orders'], { queryParams: { status: null, author: null, page: "1" }, queryParamsHandling: 'merge' });
  }

  showNewOrders() {
    if (!this.newActive) {
      this.noneActive = false;
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;

      this.ordersTableComponent.showOrdersByStatus("new");
      this.newActive = true;
      this.router.navigate(['/orders'], { queryParams: { status: "new", page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showLeadOrders() {
    if (!this.leadActive) {
      this.noneActive = false;
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;

      this.ordersTableComponent.showOrdersByStatus("lead");
      this.leadActive = true;
      this.router.navigate(['/orders'], { queryParams: { status: "lead", page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showInProgressOrders() {
    if (!this.inProgressActive) {
      this.noneActive = false;
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;

      this.ordersTableComponent.showOrdersByStatus("in_progress");
      this.inProgressActive = true;
      this.router.navigate(['/orders'], { queryParams: { status: "in_progress", page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showDoneOrders() {
    if (!this.doneActive) {
      this.noneActive = false;
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;

      this.ordersTableComponent.showOrdersByStatus("done");
      this.doneActive = true;
      this.router.navigate(['/orders'], { queryParams: { status: "done", page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showPayedOrders() {
    if (!this.payedActive) {
      this.noneActive = false;
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;

      this.ordersTableComponent.showOrdersByStatus("payed");
      this.payedActive = true;
      this.router.navigate(['/orders'], { queryParams: { status: "payed", page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showDeniedOrders() {
    if (!this.deniedActive) {
      this.noneActive = false;
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;

      this.ordersTableComponent.showOrdersByStatus("denied");
      this.deniedActive = true;
      this.router.navigate(['/orders'], { queryParams: { status: "denied", page: "1" }, queryParamsHandling: 'merge' });
    }
  }

}
