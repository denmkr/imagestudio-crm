import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
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

  constructor(public formbuilder: FormBuilder) { }

  updateParties() {
    this.searchStrings.emit(this.searchForm.get("search").value);
  }

  ngOnInit() {
  	this.search = new FormControl("", [
  	  Validators.required
  	]);
 
  	this.searchForm = new FormGroup({
      search: this.search
    });
  }

}
