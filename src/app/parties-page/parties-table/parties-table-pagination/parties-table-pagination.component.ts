import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-parties-table-pagination',
  templateUrl: './parties-table-pagination.component.html',
  styleUrls: ['./parties-table-pagination.component.css']
})
export class PartiesTablePaginationComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter<String>();

  paginator = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  	this.activatedRoute.queryParams.subscribe(params => {
        this.eventEmitter.emit(params['page']);
    });
  }

  changePage(page: number) {
  	this.eventEmitter.emit(page.toString());
  	this.router.navigate(['/parties'], { queryParams: { page: page.toString() }, queryParamsHandling: 'merge' });
  }
}
