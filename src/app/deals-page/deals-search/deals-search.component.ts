import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { DealsPageComponent } from '../deals-page.component';

@Component({
  selector: 'deals-search',
  templateUrl: './deals-search.component.html',
  styleUrls: ['./deals-search.component.css']
})
export class DealsSearchComponent implements OnInit {

  @Output() filterEmitter = new EventEmitter<FormGroup>();

  filterForm: FormGroup;
  search: FormControl;

  constructor(private formbuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) { }

  updateDeals() {
    if (this.search.value === "") this.search.setValue(null);
    this.router.navigate(['/deals'], { queryParams: { search: this.search.value }, queryParamsHandling: 'merge' });

    this.filterEmitter.emit(this.filterForm);
  }

  ngOnInit() {
  	this.search = new FormControl("");
 
  	this.filterForm = new FormGroup({
      search: this.search
    });

    this.activatedRoute.queryParams.subscribe(params => {
        this.search.setValue(params['search']);
    });
  }

}
