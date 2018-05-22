import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { DocumentsPageComponent } from '../documents-page.component';

@Component({
  selector: 'documents-search',
  templateUrl: './documents-search.component.html',
  styleUrls: ['./documents-search.component.css']
})
export class DocumentsSearchComponent implements OnInit {

  @Output() filterEmitter = new EventEmitter<FormGroup>();

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

  updateDocuments() {
    // if (this.category.value === "all") this.category.setValue(null);
    if (this.search.value === "") this.search.setValue(null);
    this.router.navigate(['/documents'], { queryParams: { search: this.search.value }, queryParamsHandling: 'merge' });

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
  }

}
