import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

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
