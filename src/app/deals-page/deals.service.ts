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
            order.status = "Новая заявка";
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
        number: order.number,
        status: order.status,
        price: order.price,
        profit: order.profit,
        deadline: order.must_be_finished_at,
      }));

      return [deals, result.meta];

    });
  }

}