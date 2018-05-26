import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { DealsTableComponent } from './deals-table/deals-table.component';
import { DealsSearchComponent } from './deals-search/deals-search.component';

@Component({
  selector: 'app-deals-page',
  templateUrl: './deals-page.component.html',
  styleUrls: ['./deals-page.component.css']
})

export class DealsPageComponent implements OnInit {
  @ViewChild(DealsTableComponent) dealsTableComponent: DealsTableComponent;
  @ViewChild(DealsSearchComponent) dealsSearchComponent: DealsSearchComponent;

  @HostBinding('class.active')
  newActive: boolean = false;
  leadActive: boolean = false;
  workActive: boolean = false;
  debtActive: boolean = false;
  doneActive: boolean = false;
  dumbActive: boolean = false;
  filersActive: boolean = false;

  mineActive: boolean = true;
  allActive: boolean = false;

  title = "Сделки";

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() { 
    this.activatedRoute.queryParams.subscribe(params => {
        let own = params['own'];
        if (own == "mine") this.mineActive = true;
        if (own == "all") this.allActive = true;

        let category = params['category'];
        if (category == "new") this.newActive = true;
        if (category == "lead") this.leadActive = true;
        if (category == "work") this.workActive = true;
        if (category == "debt") this.debtActive = true;
        if (category == "done") this.doneActive = true;
        if (category == "dumb") this.dumbActive = true;
    });
  }

  updateTableByFilterForm(formGroup: FormGroup) {
    this.dealsTableComponent.showDealsByFilterForm(formGroup);
  }

  toggleFilters() {
    this.filersActive = !this.filersActive;
  }

  showMyDeals() {
    if (!this.mineActive) {
      this.dealsTableComponent.showDealsByPossess("mine");
      this.mineActive = true;
      this.allActive = false;
      this.router.navigate(['/deals'], { queryParams: { own: "mine", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByPossess(null);
      this.mineActive = false;
      this.allActive = false;
      this.router.navigate(['/deals'], { queryParams: { own: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showAllDeals() {
    if (!this.allActive) {
      this.dealsTableComponent.showDealsByPossess("all");
      this.mineActive = false;
      this.allActive = true;
      this.router.navigate(['/deals'], { queryParams: { own: "all", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByPossess(null);
      this.mineActive = false;
      this.allActive = false;
      this.router.navigate(['/deals'], { queryParams: { own: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showNewDeals() {
    if (!this.newActive) {
      this.dealsTableComponent.showDealsByCategory("new");
      this.newActive = true;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/deals'], { queryParams: { category: "new", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByCategory(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/deals'], { queryParams: { category: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showLeadDeals() {
    if (!this.leadActive) {
      this.dealsTableComponent.showDealsByCategory("lead");
      this.newActive = false;
      this.leadActive = true;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/deals'], { queryParams: { category: "lead", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByCategory(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/deals'], { queryParams: { category: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showWorkDeals() {
    if (!this.workActive) {
      this.dealsTableComponent.showDealsByCategory("work");
      this.newActive = false;
      this.leadActive = false;
      this.workActive = true;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/deals'], { queryParams: { category: "work", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByCategory(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/deals'], { queryParams: { category: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showDebtDeals() {
    if (!this.debtActive) {
      this.dealsTableComponent.showDealsByCategory("debt");
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = true;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/deals'], { queryParams: { category: "debt", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByCategory(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/deals'], { queryParams: { category: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showDoneDeals() {
    if (!this.doneActive) {
      this.dealsTableComponent.showDealsByCategory("done");
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = true;
      this.dumbActive = false;
      this.router.navigate(['/deals'], { queryParams: { category: "done", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByCategory(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/deals'], { queryParams: { category: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showDumbDeals() {
    if (!this.dumbActive) {
      this.dealsTableComponent.showDealsByCategory("dumb");
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = true;
      this.router.navigate(['/deals'], { queryParams: { category: "dumb", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.dealsTableComponent.showDealsByCategory(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/deals'], { queryParams: { category: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

}
