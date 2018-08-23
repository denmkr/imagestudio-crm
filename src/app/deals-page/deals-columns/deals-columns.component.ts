import { OnInit, Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Route, ActivatedRoute } from '@angular/router';
import { DealsService } from '../deals.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'deals-columns',
  templateUrl: './deals-columns.component.html',
  styleUrls: ['./deals-columns.component.css'],
  providers: [DealsService]
})
export class DealsColumnsComponent implements OnInit {

  newDeals = [];
  leadDeals = [];
  workDeals = [];
  debtActive = [];
  doneDeals = [];
  dumbDeals = [];

  currentSearch: string;
  currentUserId: string;

  constructor(private dealsService: DealsService, private activatedRoute: ActivatedRoute, private authService: AuthService) { 
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
  	this.dealsService.getColumnDealsByParams("new", this.currentSearch, user_id).subscribe(result => { this.newDeals = result });
  	this.dealsService.getColumnDealsByParams("lead", this.currentSearch, user_id).subscribe(result => { this.leadDeals = result });
  	this.dealsService.getColumnDealsByParams("work", this.currentSearch, user_id).subscribe(result => { this.workDeals = result });
  	this.dealsService.getColumnDealsByParams("debt", this.currentSearch, user_id).subscribe(result => { this.debtActive = result });
  	this.dealsService.getColumnDealsByParams("done", this.currentSearch, user_id).subscribe(result => { this.doneDeals = result });
  	this.dealsService.getColumnDealsByParams("dumb", this.currentSearch, user_id).subscribe(result => { this.dumbDeals = result });
  }

  showDealsByFilterForm(formGroup: FormGroup) {
    this.dealsService.getColumnDealsByParams("new", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.newDeals = result });
    this.dealsService.getColumnDealsByParams("lead", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.leadDeals = result });
    this.dealsService.getColumnDealsByParams("work", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.workDeals = result });
    this.dealsService.getColumnDealsByParams("debt", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.debtActive = result });
    this.dealsService.getColumnDealsByParams("done", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.doneDeals = result });
    this.dealsService.getColumnDealsByParams("dumb", formGroup.get("search").value, this.currentUserId).subscribe(result => { this.dumbDeals = result });
  }

  showAllDeals() {
    this.dealsService.getColumnDealsByParams("new", this.currentSearch, this.currentUserId).subscribe(result => { this.newDeals = result });
    this.dealsService.getColumnDealsByParams("lead", this.currentSearch, this.currentUserId).subscribe(result => { this.leadDeals = result });
    this.dealsService.getColumnDealsByParams("work", this.currentSearch, this.currentUserId).subscribe(result => { this.workDeals = result });
    this.dealsService.getColumnDealsByParams("debt", this.currentSearch, this.currentUserId).subscribe(result => { this.debtActive = result });
    this.dealsService.getColumnDealsByParams("done", this.currentSearch, this.currentUserId).subscribe(result => { this.doneDeals = result });
    this.dealsService.getColumnDealsByParams("dumb", this.currentSearch, this.currentUserId).subscribe(result => { this.dumbDeals = result });
  }
}
