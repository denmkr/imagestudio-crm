import { Component, OnInit, Output, EventEmitter, ViewChild, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { PartiesPageComponent } from '../parties-page.component';

@Component({
  selector: 'parties-search',
  templateUrl: './parties-search.component.html',
  styleUrls: ['./parties-search.component.css']
})
export class PartiesSearchComponent implements OnInit {

  @Output() filterEmitter = new EventEmitter<FormGroup>();
  @HostBinding('class.active') showClearButtonClass: boolean = false;

  filterForm: FormGroup;
  search: FormControl;

  constructor(private formbuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) { }

  clearInput() {
    this.filterForm.reset();
    this.updateParties();
  }

  updateParties() {
    if (this.search.value != "" && this.search.value != undefined && this.search.value != null) this.showClearButtonClass = true;
    else this.showClearButtonClass = false;

    if (this.search.value === "") this.search.setValue(null);
    this.router.navigate(['/parties'], { queryParams: { search: this.search.value, page: "1" }, queryParamsHandling: 'merge' });

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

    if (this.search.value != "" && this.search.value != undefined && this.search.value != null) this.showClearButtonClass = true;
  }

}
