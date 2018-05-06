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

  @Output() filterEmitter = new EventEmitter<FormGroup>();

  filterForm: FormGroup;
  search: FormControl;
  category: FormControl;

  public categories = [
      {text: 'Все', id: "all"}, 
      {text: 'Государство', id: "state"}, 
      {text: 'Бизнес', id: "business"},
      {text: 'Частное лицо', id: "private"}
  ];

  constructor(private formbuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) { }

  updateParties() {
    this.filterEmitter.emit(this.filterForm);
    if (this.category.value === "all") this.category.setValue(null);
    if (this.search.value === "") this.search.setValue(null);
    this.router.navigate(['/parties'], { queryParams: { search: this.search.value, category: this.category.value}, queryParamsHandling: 'merge' });
  }

  ngOnInit() {
  	this.search = new FormControl("");
    this.category = new FormControl("");
 
  	this.filterForm = new FormGroup({
      search: this.search,
      category: this.category
    });

    this.activatedRoute.queryParams.subscribe(params => {
        this.search.setValue(params['search']);
        this.category.setValue(params['category']);
    });
  }

}
