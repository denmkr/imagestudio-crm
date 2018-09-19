import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class DealsService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getOrganizations() {
    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/organizations/")
    .map(result => {
      return result.organizations.map(organization => ({
        id: organization.id,
        text: organization.name
      }))
    });
  }

  createOrganization(name: string) {
    let httpParams = new HttpParams();
    if (name != null && name != undefined) { httpParams = httpParams.set('name', name); }

    this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/organizations/', { params: httpParams }).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    );
  }

  removeDeal(id: string) {
    this.http.delete('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders/' + id).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    ); 
  }

  updateDeal(id: string, type: string, category: string, organization: string, email: string, contact: string, 
    position: string, phone: string, comment: string) {

    const document = {
      id: id,
      kind: type,
      category: category,
      organization: {
        id: organization
      },
      email: email,
      contact_name: contact,
      position: position,
      contact_phone: phone,
      comment: comment,
      user: {
        id: this.authService.getUserId()
      }
    };

    this.http.put('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders/' + id, document).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    );
    
  }

  createNewDeal(type: string, category: string, counterparty: string, comment: string) {

    const document = {
      kind: type,
      category: category,
      counterparty: counterparty,
      comment: comment,
      user: {
        id: this.authService.getUserId()
      }
    };

    this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders/', document).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    );
    
  }

  getColumnDealsByParams(status: string, search: string, user_id: string) {
    let httpParams = new HttpParams();
    if (status != null && status != undefined) { httpParams = httpParams.set('status', status); }
    if (user_id != null && user_id != undefined) { httpParams = httpParams.set('user_id', user_id); }
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }
    httpParams = httpParams.set('page[size]', '25');

    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders/", { params: httpParams, reportProgress: true })
    .map(result => {

      let names;

      result.orders.map(order => {
        names = "";

        order.orders_positions.map(position => {
          position.orders_items.map(item => {
            if (names != "") names += ", ";
            names += item.product.name;
          });
        });
        order.names = names;
      });

      let deals = result.orders.map(order => ({
        id: order.id,
        names: order.names,
        client: order.counterparty.organization.name,
        deadline: order.must_be_finished_at
      }));

      return deals;

    });

  }

  getDealsByParams(status: string, search: string, page: string, user_id: string) {

    let httpParams = new HttpParams();
    if (status != null && status != undefined) { httpParams = httpParams.set('status', status); }
    if (user_id != null && user_id != undefined) { httpParams = httpParams.set('user_id', user_id); }
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }
    if (page != null && page != undefined) httpParams = httpParams.set('page[number]', page);
    if (page != null && page != undefined) httpParams = httpParams.set('page[size]', '25');


    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders/", { params: httpParams, reportProgress: true })
    .map(result => {
      let names;

      result.orders.map(order => {
        names = "";
        
        switch (order.status) {
          case "new":
            order.status = "Новое";
            break;
          case "lead":
            order.status = "Лид";
            break;
          case "work":
            order.status = "В работе";
            break;
          case "debt":
            order.status = "Не оплачено";
            break;
          case "done":
            order.status = "Выполнено";
            break;
          case "dumb":
            order.status = "Слив";
            break;
          default:
            break;
        };

        let events: any[] = [];

        order.available_events.map(available_event => {
          switch (available_event) {
            case "new":
              events.push("Новое");
              break;
            case "accept":
              events.push("Лид");
              break;
            case "work":
              events.push("В работе");
              break;
            case "debt":
              events.push("Не оплачено");
              break;
            case "done":
              events.push("Выполнено");
              break;
            case "archive":
              events.push("Слив");
              break;
            default:
              break;
          };
        });

        order.available_events = events;
        order.available_events.push(order.status);

        order.orders_positions.map(position => {
          if (names != "") names += ", ";
          names += position.product.name;

          let position_events: any[] = [];

          switch (position.status) {
            case "new":
              position.status = "Новое";
              break;
            case "lead":
              position.status = "Лид";
              break;
            case "work":
              position.status = "В работе";
              break;
            case "debt":
              position.status = "Не оплачено";
              break;
            case "done":
              position.status = "Выполнено";
              break;
            case "dumb":
              position.status = "Слив";
              break;
            default:
              break;
          };

          position.available_events.map(available_event => {
            switch (available_event) {
              case "new":
                position_events.push("Новое");
                break;
              case "accept":
                position_events.push("Лид");
                break;
              case "work":
                position_events.push("В работе");
                break;
              case "debt":
                position_events.push("Не оплачено");
                break;
              case "done":
                position_events.push("Выполнено");
                break;
              case "archive":
                position_events.push("Слив");
                break;
              default:
                break;
            };
          });

          position.available_events = position_events;
          position.available_events.push(position.status);

        });

        order.names = names;

      });

      let deals = result.orders.map(order => ({
        id: order.id,
        names: order.names,
        organization: order.counterparty.organization.name,
        client: order.counterparty.contact_name,
        number: order.number,
        status: order.status,
        price: order.price,
        profit: order.profit,
        orders_positions: order.orders_positions,
        deadline: order.must_be_finished_at,
        readiness: order.readiness,
        available_events: order.available_events
      }));

      return [deals, result.meta];

    });
  }

}