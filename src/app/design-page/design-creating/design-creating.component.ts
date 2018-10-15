import { Component, OnInit, ViewChild } from '@angular/core';
declare var require: any;

@Component({
  selector: 'app-design-creating',
  templateUrl: './design-creating.component.html',
  styleUrls: ['./design-creating.component.css']
})
export class DesignCreatingComponent implements OnInit {

  title = "Новая заявка";
  cancelLink = "/design";
  private left_arrow = require("../images/left-arrow.png");

  constructor() { }

  ngOnInit() {
  }

}
