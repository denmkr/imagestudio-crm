import { Component, OnInit, Output, EventEmitter, ViewChild, HostBinding } from '@angular/core';
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
  @HostBinding('class.active') showClearButtonClass: boolean = false;

  filterForm: FormGroup;
  search: FormControl;

  constructor(private formbuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) { }

  clearInput() {
    this.filterForm.reset();
    this.updateDocuments();
  }

  updateDocuments() {
    if (this.search.value != "" && this.search.value != undefined && this.search.value != null) this.showClearButtonClass = true;
    else this.showClearButtonClass = false;

    if (this.search.value === "") this.search.setValue(null);
    this.router.navigate(['/documents'], { queryParams: { search: this.search.value, page: "1" }, queryParamsHandling: 'merge' });

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
