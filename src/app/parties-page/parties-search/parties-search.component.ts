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
  // category: FormControl;

  /*
  public categories = [
    {text: 'Все', id: "all"}, 
    {text: 'Государство', id: "state"}, 
    {text: 'Бизнес', id: "business"},
    {text: 'Частное лицо', id: "individual"}
  ];
  */

  constructor(private formbuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) { }

  clearInput() {
    this.filterForm.reset();
    this.updateParties();
  }

  updateParties() {
    if (this.search.value != "" && this.search.value != undefined && this.search.value != null) this.showClearButtonClass = true;
    else this.showClearButtonClass = false;

    // if (this.category.value === "all") this.category.setValue(null);
    if (this.search.value === "") this.search.setValue(null);
    this.router.navigate(['/parties'], { queryParams: { search: this.search.value, page: "1" }, queryParamsHandling: 'merge' });

    this.filterEmitter.emit(this.filterForm);
  }

  ngOnInit() {
  	this.search = new FormControl("");
    // this.category = new FormControl("");
 
  	this.filterForm = new FormGroup({
      search: this.search
      // category: this.category
    });

    this.activatedRoute.queryParams.subscribe(params => {
        this.search.setValue(params['search']);
        // this.category.setValue(params['category']);
    });

    if (this.search.value != "" && this.search.value != undefined && this.search.value != null) this.showClearButtonClass = true;
  }

}
