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
   
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

}
