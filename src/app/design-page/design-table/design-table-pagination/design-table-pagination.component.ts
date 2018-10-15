import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'design-table-pagination',
  templateUrl: './design-table-pagination.component.html',
  styleUrls: ['./design-table-pagination.component.css']
})
export class DesignTablePaginationComponent implements OnInit {

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
  	this.router.navigate(['/design'], { queryParams: { page: page.toString() }, queryParamsHandling: 'merge' });
  }
}
