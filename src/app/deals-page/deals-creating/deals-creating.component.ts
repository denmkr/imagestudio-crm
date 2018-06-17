import { Component, OnInit } from '@angular/core';
declare var require: any;
@Component({
  selector: 'app-deals-creating',
  templateUrl: './deals-creating.component.html',
  styleUrls: ['./deals-creating.component.css']
})
export class DealsCreatingComponent implements OnInit {

  title = "Новая сделка";
  cancelLink = "/deals";
  private left_arrow = require("../images/left-arrow.png");

  constructor() { }

  ngOnInit() {
  }

}
