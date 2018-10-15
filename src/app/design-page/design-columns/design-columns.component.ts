import { OnInit, Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Route, ActivatedRoute } from '@angular/router';
import { DesignService } from '../design.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'design-columns',
  templateUrl: './design-columns.component.html',
  styleUrls: ['./design-columns.component.css']
})
export class DesignColumnsComponent implements OnInit {

  newDeals = [];
  leadDeals = [];
  workDeals = [];
  debtActive = [];
  doneDeals = [];
  dumbDeals = [];

  currentSearch: string;
  currentUserId: string;

  constructor(private designService: DesignService, private activatedRoute: ActivatedRoute, private authService: AuthService) { 
    this.activatedRoute.queryParams.subscribe(params => {
        this.currentSearch = params['search'];
        this.currentUserId = params['author'];
    });
  }

  ngOnInit() {
  	if (this.currentUserId == "user") this.currentUserId = this.authService.getUserId();
    else this.currentUserId = null;

    this.showAllDeals();
  }

  showDealsByPossess(user_id: string) {
  	this.designService.getColumnDealsByParams("new", this.currentSearch, user_id).subscribe(result => { this.newDeals = result });
  	this.designService.getColumnDealsByParams("lead", this.currentSearch, user_id).subscribe(result => { this.leadDeals = result });
  	this.designService.getColumnDealsByParams("work", this.currentSearch, user_id).subscribe(result => { this.workDeals = result });
  	this.designService.getColumnDealsByParams("debt", this.currentSearch, user_id).subscribe(result => { this.debtActive = result });
  	this.designService.getColumnDealsByParams("done", this.currentSearch, user_id).subscribe(result => { this.doneDeals = result });
  	this.designService.getColumnDealsByParams("dumb", this.currentSearch, user_id).subscribe(result => { this.dumbDeals = result });
  }

  showDealsByFilterForm(formGroup: FormGroup) {
    this.designService.getColumnDealsByParams("new", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.newDeals = result });
    this.designService.getColumnDealsByParams("lead", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.leadDeals = result });
    this.designService.getColumnDealsByParams("work", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.workDeals = result });
    this.designService.getColumnDealsByParams("debt", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.debtActive = result });
    this.designService.getColumnDealsByParams("done", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.doneDeals = result });
    this.designService.getColumnDealsByParams("dumb", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.dumbDeals = result });
  }

  showAllDeals() {
    this.designService.getColumnDealsByParams("new", this.currentSearch, this.currentUserId).subscribe(result => { this.newDeals = result });
    this.designService.getColumnDealsByParams("lead", this.currentSearch, this.currentUserId).subscribe(result => { this.leadDeals = result });
    this.designService.getColumnDealsByParams("work", this.currentSearch, this.currentUserId).subscribe(result => { this.workDeals = result });
    this.designService.getColumnDealsByParams("debt", this.currentSearch, this.currentUserId).subscribe(result => { this.debtActive = result });
    this.designService.getColumnDealsByParams("done", this.currentSearch, this.currentUserId).subscribe(result => { this.doneDeals = result });
    this.designService.getColumnDealsByParams("dumb", this.currentSearch, this.currentUserId).subscribe(result => { this.dumbDeals = result });
  }
}
