import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { PartiesPageComponent } from '../parties-page.component';

@Component({
  selector: 'parties-search',
  templateUrl: './parties-search.component.html',
  styleUrls: ['./parties-search.component.css']
})
export class PartiesSearchComponent implements OnInit {

  @Output() searchStrings = new EventEmitter<string>();

  searchForm: FormGroup;
  search: FormControl;

  constructor(private formbuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) { }

  updateParties() {
    this.searchStrings.emit(this.searchForm.get("search").value);
    this.router.navigate(['/parties'], { queryParams: { search: this.search.value}, queryParamsHandling: 'merge' });
  }

  ngOnInit() {
  	this.search = new FormControl("", [
  	  Validators.required
  	]);
 
  	this.searchForm = new FormGroup({
      search: this.search
    });

    this.activatedRoute.queryParams.subscribe(params => {
        this.search.setValue(params['search']);
    });
  }

}
