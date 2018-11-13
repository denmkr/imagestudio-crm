import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormGroup } from '@angular/forms';

import { DealsColumnsComponent } from './deals-columns/deals-columns.component';
import { DealsTableComponent } from './deals-table/deals-table.component';
import { DealsSearchComponent } from './deals-search/deals-search.component';

@Component({
  selector: 'app-deals-page',
  templateUrl: './deals-page.component.html',
  styleUrls: ['./deals-page.component.css']
})

export class DealsPageComponent implements OnInit {
  @ViewChild(DealsTableComponent) dealsTableComponent: DealsTableComponent;
  @ViewChild(DealsColumnsComponent) dealsColumnsComponent: DealsColumnsComponent;
  @ViewChild(DealsSearchComponent) dealsSearchComponent: DealsSearchComponent;

  @HostBinding('class.active')
  newActive: boolean = false;
  leadActive: boolean = false;
  inProgressActive: boolean = false;
  doneActive: boolean = false;
  payedActive: boolean = false;
  deniedActive: boolean = false;
  filersActive: boolean = false;

  mineActive: boolean = false;
  allActive: boolean = false;

  verticalMode: boolean = false;

  title = "Сделки";
  creatingLink = "/deals/create";

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() { 
    this.activatedRoute.queryParams.subscribe(params => {
        let author = params['author'];
        if (author == "user") this.mineActive = true;
        else this.allActive = true;

        let status = params['status'];
        if (status == "new") this.newActive = true;
        if (status == "lead") this.leadActive = true;
        if (status == "in_progress") this.inProgressActive = true;
        if (status == "done") this.doneActive = true;
        if (status == "payed") this.payedActive = true;
        if (status == "denied") this.deniedActive = true;

        if (localStorage.getItem('mode') == "vert") this.verticalMode = true;
    });
  }

  updateTableByFilterForm(formGroup: FormGroup) {
    if (this.verticalMode) this.dealsColumnsComponent.showDealsByFilterForm(formGroup);
    else this.dealsTableComponent.showDealsByFilterForm(formGroup);
  }

  toggleFilters() {
    this.filersActive = !this.filersActive;
  }

  setColumnsMode() {
    this.verticalMode = true;
    localStorage.setItem('mode', 'vert'); 
  }

  setTableMode() {
    this.verticalMode = false;
    localStorage.setItem('mode', 'hor'); 
  }

  showMyDeals() {
    if (!this.mineActive) {
      if (this.verticalMode) this.dealsColumnsComponent.showDealsByPossess(this.authService.getUserId());
      else this.dealsTableComponent.showDealsByPossess(this.authService.getUserId());
      this.mineActive = true;
      this.allActive = false;
      this.router.navigate(['/deals'], { queryParams: { author: "user", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      if (this.verticalMode) this.dealsColumnsComponent.showDealsByPossess(null);
      else this.dealsTableComponent.showDealsByPossess(null);
      this.mineActive = false;
      this.allActive = false;
      this.router.navigate(['/deals'], { queryParams: { author: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showAllDeals() {
    if (this.verticalMode) this.dealsColumnsComponent.showDealsByPossess(null);
    else this.dealsTableComponent.showDealsByPossess(null);

    if (!this.allActive) {
      this.mineActive = false;
      this.allActive = true;
    }
    else {
      this.mineActive = false;
      this.allActive = false;
    }

    this.router.navigate(['/deals'], { queryParams: { author: null, page: "1" }, queryParamsHandling: 'merge' });
  }

  showNewDeals() {
    if (!this.newActive) {
      this.dealsTableComponent.showDealsByStatus("new");
      this.newActive = true;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;
      this.router.navigate(['/deals'], { queryParams: { status: "new", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;
      this.router.navigate(['/deals'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showLeadDeals() {
    if (!this.leadActive) {
      this.dealsTableComponent.showDealsByStatus("lead");
      this.newActive = false;
      this.leadActive = true;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;
      this.router.navigate(['/deals'], { queryParams: { status: "lead", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;
      this.router.navigate(['/deals'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showInProgressDeals() {
    if (!this.inProgressActive) {
      this.dealsTableComponent.showDealsByStatus("in_progress");
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = true;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;
      this.router.navigate(['/deals'], { queryParams: { status: "in_progress", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;
      this.router.navigate(['/deals'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showDoneDeals() {
    if (!this.doneActive) {
      this.dealsTableComponent.showDealsByStatus("done");
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = true;
      this.payedActive = false;
      this.deniedActive = false;
      this.router.navigate(['/deals'], { queryParams: { status: "done", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;
      this.router.navigate(['/deals'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showPayedDeals() {
    if (!this.payedActive) {
      this.dealsTableComponent.showDealsByStatus("payed");
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = true;
      this.deniedActive = false;
      this.router.navigate(['/deals'], { queryParams: { status: "payed", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;
      this.router.navigate(['/deals'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showDeniedDeals() {
    if (!this.deniedActive) {
      this.dealsTableComponent.showDealsByStatus("denied");
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = true;
      this.router.navigate(['/deals'], { queryParams: { status: "denied", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.inProgressActive = false;
      this.doneActive = false;
      this.payedActive = false;
      this.deniedActive = false;
      this.router.navigate(['/deals'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

}
