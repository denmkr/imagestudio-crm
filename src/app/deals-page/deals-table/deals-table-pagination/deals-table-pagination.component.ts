import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'deals-table-pagination',
  templateUrl: './deals-table-pagination.component.html',
  styleUrls: ['./deals-table-pagination.component.css']
})
export class DealsTablePaginationComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter<String>();

  paginator = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['page'] != null && params['page'] != undefined) {
        this.eventEmitter.emit(params['page']);
      }
    });
  }

  changePage(page: number) {
  	this.eventEmitter.emit(page.toString());
  	this.router.navigate(['/deals'], { queryParams: { page: page.toString() }, queryParamsHandling: 'merge' });
  }
}
