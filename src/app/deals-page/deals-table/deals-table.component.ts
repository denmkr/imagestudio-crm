import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Route, ActivatedRoute } from '@angular/router';

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
  currentCategory: string;
  currentContact: string;
  currentSearch: string;

  constructor(private dealsService: DealsService, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(params => {
        this.currentCategory = params['category'];
        this.currentContact = params['contact'];
        this.currentSearch = params['search'];
    });
  }

  showEditModal(document) {
    this.eventEmitter.emit(document);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page'] != null && params['page'] != undefined) {
        this.showDealsByPage(params['page']);
      }
      else this.showAllDeals();
    });
  }

  showDealsByPage(page: number) {
    this.dealsService.getDealsByParams(this.currentCategory, this.currentContact, this.currentSearch, page.toString()).subscribe(
      result => { 
        this.deals = result[0]; 
        this.dealsTablePaginationComponent.paginator = result[1]; 
      }
    );
  }

  showAllDeals() {
    this.dealsService.getDealsByParams(this.currentCategory, this.currentContact, this.currentSearch, "1").subscribe(result => { this.deals = result[0]; this.dealsTablePaginationComponent.paginator = result[1];  });
  }

  showDealsByPossess(own: string) {
  	this.dealsService.getDealsByParams(own, this.currentContact, this.currentSearch, "1").subscribe(result => { this.deals = result[0]; this.dealsTablePaginationComponent.paginator = result[1];  });
  }

  showDealsByCategory(category: string) {
    this.dealsService.getDealsByParams(category, this.currentContact, this.currentSearch, "1").subscribe(result => { this.deals = result[0]; this.dealsTablePaginationComponent.paginator = result[1];  });
  }

  showDealsByFilterForm(formGroup: FormGroup) {
    this.dealsService.getDealsByParams(this.currentCategory, this.currentContact, formGroup.get("search").value, "1").subscribe(result => { this.deals = result[0]; this.dealsTablePaginationComponent.paginator = result[1];  });
  }
}