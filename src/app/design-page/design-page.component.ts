import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormGroup } from '@angular/forms';

import { DesignColumnsComponent } from './design-columns/design-columns.component';
import { DesignTableComponent } from './design-table/design-table.component';
import { DesignSearchComponent } from './design-search/design-search.component';

@Component({
  selector: 'app-design-page',
  templateUrl: './design-page.component.html',
  styleUrls: ['./design-page.component.css']
})

export class DesignPageComponent implements OnInit {
  @ViewChild(DesignTableComponent) designTableComponent: DesignTableComponent;
  @ViewChild(DesignColumnsComponent) designColumnsComponent: DesignColumnsComponent;
  @ViewChild(DesignSearchComponent) designSearchComponent: DesignSearchComponent;

  @HostBinding('class.active')
  newActive: boolean = false;
  leadActive: boolean = false;
  workActive: boolean = false;
  debtActive: boolean = false;
  doneActive: boolean = false;
  dumbActive: boolean = false;
  filersActive: boolean = false;

  mineActive: boolean = false;
  allActive: boolean = false;

  verticalMode: boolean = false;

  title = "Дизайн";
  creatingLink = "/design/create";

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() { 
    this.activatedRoute.queryParams.subscribe(params => {
        let author = params['author'];
        if (author == "user") this.mineActive = true;
        else this.allActive = true;

        let status = params['status'];
        if (status == "new") this.newActive = true;
        if (status == "lead") this.leadActive = true;
        if (status == "work") this.workActive = true;
        if (status == "debt") this.debtActive = true;
        if (status == "done") this.doneActive = true;
        if (status == "dumb") this.dumbActive = true;

        if (localStorage.getItem('mode') == "vert") this.verticalMode = true;
    });
  }

  updateTableByFilterForm(formGroup: FormGroup) {
    if (this.verticalMode) this.designColumnsComponent.showDealsByFilterForm(formGroup);
    else this.designTableComponent.showDealsByFilterForm(formGroup);
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
      if (this.verticalMode) this.designColumnsComponent.showDealsByPossess(this.authService.getUserId());
      else this.designTableComponent.showDealsByPossess(this.authService.getUserId());
      this.mineActive = true;
      this.allActive = false;
      this.router.navigate(['/design'], { queryParams: { author: "user", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      if (this.verticalMode) this.designColumnsComponent.showDealsByPossess(null);
      else this.designTableComponent.showDealsByPossess(null);
      this.mineActive = false;
      this.allActive = false;
      this.router.navigate(['/design'], { queryParams: { author: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showAllDeals() {
    if (this.verticalMode) this.designColumnsComponent.showDealsByPossess(null);
    else this.designTableComponent.showDealsByPossess(null);

    if (!this.allActive) {
      this.mineActive = false;
      this.allActive = true;
    }
    else {
      this.mineActive = false;
      this.allActive = false;
    }

    this.router.navigate(['/design'], { queryParams: { author: null, page: "1" }, queryParamsHandling: 'merge' });
  }

  showNewDeals() {
    if (!this.newActive) {
      this.designTableComponent.showDealsByStatus("new");
      this.newActive = true;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/design'], { queryParams: { status: "new", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.designTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/design'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showLeadDeals() {
    if (!this.leadActive) {
      this.designTableComponent.showDealsByStatus("lead");
      this.newActive = false;
      this.leadActive = true;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/design'], { queryParams: { status: "lead", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.designTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/design'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showWorkDeals() {
    if (!this.workActive) {
      this.designTableComponent.showDealsByStatus("work");
      this.newActive = false;
      this.leadActive = false;
      this.workActive = true;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/design'], { queryParams: { status: "work", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.designTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/design'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showDebtDeals() {
    if (!this.debtActive) {
      this.designTableComponent.showDealsByStatus("debt");
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = true;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/design'], { queryParams: { status: "debt", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.designTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/design'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showDoneDeals() {
    if (!this.doneActive) {
      this.designTableComponent.showDealsByStatus("done");
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = true;
      this.dumbActive = false;
      this.router.navigate(['/design'], { queryParams: { status: "done", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.designTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/design'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

  showDumbDeals() {
    if (!this.dumbActive) {
      this.designTableComponent.showDealsByStatus("dumb");
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = true;
      this.router.navigate(['/design'], { queryParams: { status: "dumb", page: "1" }, queryParamsHandling: 'merge' });
    }
    else {
      this.designTableComponent.showDealsByStatus(null);
      this.newActive = false;
      this.leadActive = false;
      this.workActive = false;
      this.debtActive = false;
      this.doneActive = false;
      this.dumbActive = false;
      this.router.navigate(['/design'], { queryParams: { status: null, page: "1" }, queryParamsHandling: 'merge' });
    }
  }

}
