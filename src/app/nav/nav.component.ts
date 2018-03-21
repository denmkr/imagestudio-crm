import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  items = [
    {text: "Дашборд", link: "/home"},
    {text: "Контрагенты", link: "/parties"},
    {text: "2Do", link: "/2do"},
    {text: "Сделки", link: "/deals"},
    {text: "Офис", link: "/office"},
    {text: "Дизайн", link: "/design"},
    {text: "Принт", link: "/print"},
    {text: "Склад", link: "/warehouse"},
    {text: "Документы", link: "/documents"},
    {text: "Деньги", link: "/money"},
    {text: "Аналитика", link: "/analytics"}
  ];

}
