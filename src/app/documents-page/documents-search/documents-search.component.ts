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

  constructor(private formbuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) { }

  updateDocuments() {
    if (this.search.value === "") this.search.setValue(null);
    this.router.navigate(['/documents'], { queryParams: { search: this.search.value }, queryParamsHandling: 'merge' });

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
