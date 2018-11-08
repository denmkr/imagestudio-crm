import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
declare var require: any;

@Component({
  selector: 'app-deals-editing',
  templateUrl: './deals-editing.component.html',
  styleUrls: ['./deals-editing.component.css']
})
export class DealsEditingComponent implements OnInit {

  title = "Редактирование сделки";
  cancelLink = "/deals";
  private left_arrow = require("../images/left-arrow.png");

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
	    let id = params['id'];
	    console.log(id);
    });
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

}
