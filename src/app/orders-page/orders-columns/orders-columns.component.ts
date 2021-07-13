import { OnInit, Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Route, ActivatedRoute } from '@angular/router';
import { OrdersService } from '../orders.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'orders-columns',
  templateUrl: './orders-columns.component.html',
  styleUrls: ['./orders-columns.component.css'],
  providers: [OrdersService]
})
export class OrdersColumnsComponent implements OnInit {

  newOrders = [];
  leadOrders = [];
  inProgressOrders = [];
  payedActive = [];
  doneOrders = [];
  archivedOrders = [];
  deniedOrders = [];

  currentSearch: string;
  currentUserId: string;

  constructor(private ordersService: OrdersService, private activatedRoute: ActivatedRoute, private authService: AuthService) { 
    this.activatedRoute.queryParams.subscribe(params => {
        this.currentSearch = params['search'];
        this.currentUserId = params['author'];
    });
  }

  ngOnInit() {
  	if (this.currentUserId == "user") this.currentUserId = this.authService.getUserId();
    else this.currentUserId = null;

    this.showAllOrders();
  }

  showOrdersByPossess(user_id: string) {
  	this.ordersService.getColumnOrdersByParams("new", this.currentSearch, user_id).subscribe(result => { this.newOrders = result });
  	this.ordersService.getColumnOrdersByParams("lead", this.currentSearch, user_id).subscribe(result => { this.leadOrders = result });
  	this.ordersService.getColumnOrdersByParams("in_progress", this.currentSearch, user_id).subscribe(result => { this.inProgressOrders = result });
  	this.ordersService.getColumnOrdersByParams("payed", this.currentSearch, user_id).subscribe(result => { this.payedActive = result });
  	this.ordersService.getColumnOrdersByParams("done", this.currentSearch, user_id).subscribe(result => { this.doneOrders = result });
  	this.ordersService.getColumnOrdersByParams("archived", this.currentSearch, user_id).subscribe(result => { this.archivedOrders = result });
    this.ordersService.getColumnOrdersByParams("denied", this.currentSearch, user_id).subscribe(result => { this.deniedOrders = result });
  }

  showOrdersByFilterForm(formGroup: FormGroup) {
    this.ordersService.getColumnOrdersByParams("new", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.newOrders = result });
    this.ordersService.getColumnOrdersByParams("lead", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.leadOrders = result });
    this.ordersService.getColumnOrdersByParams("in_progress", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.inProgressOrders = result });
    this.ordersService.getColumnOrdersByParams("payed", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.payedActive = result });
    this.ordersService.getColumnOrdersByParams("done", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.doneOrders = result });
    this.ordersService.getColumnOrdersByParams("archived", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.archivedOrders = result });
    this.ordersService.getColumnOrdersByParams("denied", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.deniedOrders = result });
  }

  showAllOrders() {
    this.ordersService.getColumnOrdersByParams("new", this.currentSearch, this.currentUserId).subscribe(result => { this.newOrders = result });
    this.ordersService.getColumnOrdersByParams("lead", this.currentSearch, this.currentUserId).subscribe(result => { this.leadOrders = result });
    this.ordersService.getColumnOrdersByParams("in_progress", this.currentSearch, this.currentUserId).subscribe(result => { this.inProgressOrders = result });
    this.ordersService.getColumnOrdersByParams("payed", this.currentSearch, this.currentUserId).subscribe(result => { this.payedActive = result });
    this.ordersService.getColumnOrdersByParams("done", this.currentSearch, this.currentUserId).subscribe(result => { this.doneOrders = result });
    this.ordersService.getColumnOrdersByParams("archived", this.currentSearch, this.currentUserId).subscribe(result => { this.archivedOrders = result });
    this.ordersService.getColumnOrdersByParams("denied", this.currentSearch, this.currentUserId).subscribe(result => { this.deniedOrders = result });
  }
}
