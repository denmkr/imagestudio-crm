import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { OrdersService } from '../orders.service';
import { OrdersTablePaginationComponent } from './orders-table-pagination/orders-table-pagination.component';

@Component({
  selector: 'orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.css'],
  providers: [OrdersService]
})

export class OrdersTableComponent {
  @ViewChild(OrdersTablePaginationComponent) ordersTablePaginationComponent: OrdersTablePaginationComponent;
  @Output() eventEmitter = new EventEmitter<any>();

  orders = [];
  currentStatus: string;
  currentSearch: string;
  currentUserId: string;

  statusForm: FormGroup;
  status: FormControl;

  positionStatusForm: FormGroup;
  positionStatus: FormControl;

  editingLink = "/orders/edit";

  public statusSelect = {name: "status", placeholder: "Статус", id: "statusSelect"};
  public positionStatusSelect = {name: "positionStatus", placeholder: "Статус", id: "positionStatusSelect"};

  constructor(private router: Router, private ordersService: OrdersService, private activatedRoute: ActivatedRoute, private authService: AuthService) { 
    this.activatedRoute.queryParams.subscribe(params => {
        this.currentStatus = params['status'];
        this.currentSearch = params['search'];
        this.currentUserId = params['author'];
    });
  }

  toEditPage(id, userId) {
    // if (this.authService.getUserId() == userId) this.router.navigate(['/orders/edit'], { queryParams: { id: id } });
    this.router.navigate(['/orders/edit'], { queryParams: { id: id } });
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
        this.showOrdersByPage(params['page']);
      }
      else this.showAllOrders();
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

  showOrdersByPage(page: number) {
    this.ordersService.getOrdersByParams(this.currentStatus, this.currentSearch, page.toString(), this.currentUserId).subscribe(
      result => { 
        this.orders = result[0]; 
        this.ordersTablePaginationComponent.paginator = result[1]; 
      }
    );
  }

  changeOrderStatus(id, event) {
    this.ordersService.updateOrderStatusByOrderId(event.id, id).subscribe(
      result => {
        this.statusForm.reset();
        this.showAllOrders();
      }
    );
  }

  changePositionStatus(id, event) {
    this.ordersService.updatePositionStatusByOrderId(event.id, id).subscribe(
      result => {
        this.positionStatusForm.reset();
        this.showAllOrders();
      }
    );
  }

  revealOrder(event) {
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

  showAllOrders() {
    this.ordersService.getOrdersByParams(this.currentStatus, this.currentSearch, "1", this.currentUserId).subscribe(result => { this.orders = result[0]; this.ordersTablePaginationComponent.paginator = result[1];  });
  }

  showOrdersByPossess(user_id: string) {
  	this.ordersService.getOrdersByParams(this.currentStatus, this.currentSearch, "1", user_id).subscribe(result => { this.orders = result[0]; this.ordersTablePaginationComponent.paginator = result[1];  });
  }

  showOrdersByStatus(status: string) {
    this.ordersService.getOrdersByParams(status, this.currentSearch, "1", this.currentUserId).subscribe(result => { this.orders = result[0]; this.ordersTablePaginationComponent.paginator = result[1];  });
  }

  showOrdersByFilterForm(formGroup: FormGroup) {
    this.ordersService.getOrdersByParams(this.currentStatus, formGroup.get("search").value, "1", this.currentUserId).subscribe(result => { this.orders = result[0]; this.ordersTablePaginationComponent.paginator = result[1];  });
  }
}