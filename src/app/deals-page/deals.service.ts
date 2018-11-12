import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class DealsService {
  constructor(private http: HttpClient, private authService: AuthService) {}


  createOrganization(name: string) {
    let httpParams = new HttpParams();
    if (name != null && name != undefined) { httpParams = httpParams.set('name', name); }

    this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/organizations/', { params: httpParams }).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    );
  }

  getManagers() {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page[number]', '1');
    httpParams = httpParams.set('page[size]', '2500');

    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/users/", { params: httpParams, reportProgress: true })
    .map(result => {

      let users = result.users.map(user => ({
        id: user.id,
        name: user.first_name + " " + user.last_name
      }));

      return users;
    });
  }

  getDealsBySearch(search: string) {

    let httpParams = new HttpParams();
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }
    httpParams = httpParams.set('page[number]', '1');
    httpParams = httpParams.set('page[size]', '2500');

    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders/", { params: httpParams, reportProgress: true })
    .map(result => {

      let orders = result.orders.map(order => ({
        id: order.id,
        organization: order.counterparty.organization.name,
        client: order.counterparty.contact_name,
        number: order.number
      }));

      return orders;
    });
  }

  updateDealStatusByOrderId(eventId: string, id: string) {

    const params = {
      event: eventId
    };

    this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders/' + id + '/process_event', params).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    );
  }

  updatePositionStatusByOrderId(eventId: string, id: string) {
    const params = {
      event: eventId
    };

    this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders_positions/' + id + '/process_event', params).subscribe(
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

  createNewDeal(deadline: string, doer_id: string, counterparty_id: string, comment: string, orders_positions: Array<any>) {
    let order_positions = [];

    orders_positions.map(position => {
      let position_items = [];

      position.items.map(item => {
        let newItem = {
          product: {
            id: item.product.id
          },
          organization: {
            id: item.organization.id
          },
          prime_price: item.price
        };

        position_items.push(newItem);
      });

      let newPosition = {
        product: {
          id: position.product.id
        },
        must_be_finished_at: position.deadline,
        price: position.price,
        count: position.amount,
        orders_items: position_items
      };

      order_positions.push(newPosition);

    });

    const order = {

      must_be_finished_at: deadline,
      doer: {
        id: doer_id
      },
      counterparty: {
        id: counterparty_id
      },
      comment: comment,
      orders_positions: order_positions
    };

    this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders/', order).subscribe(
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
            order.status = {name: "Новое", id: "new"};
            break;
          case "lead":
            order.status = {name: "Лид", id: "lead"};
            break;
          case "in_progress":
            order.status = {name: "В работе", id: "in_progress"};
            break;
          case "payed":
            order.status = {name: "Оплачено", id: "payed"};
            break;
          case "done":
            order.status = {name: "Выполнено", id: "done"};
            break;
          case "archived":
            order.status = {name: "Архив", id: "archived"};
            break;
          case "denied":
            order.status = {name: "Слив", id: "denied"};
            break;
          default:
            break;
        };

        let events: any[] = [];

        order.available_events.map(available_event => {
          switch (available_event) {
            case "accept":
              events.push({ name: "Лид", id: "accept" });
              break;
            case "start":
              events.push({ name: "В работе", id: "start" });
              break;
            case "complete":
              events.push({ name: "Выполнено", id: "complete" });
              break;
            case "set_payed":
              events.push({ name: "Оплачено", id: "set_payed" });
              break;
            case "archive":
              events.push({ name: "Архив", id: "archive" });
              break;
            case "deny":
              events.push({ name: "Слив", id: "deny" });
              break;
            default:
              break;
          };
        });

        order.available_events = events;

        order.orders_positions.map(position => {
          if (names != "") names += ", ";
          names += position.product.name;

          let position_events: any[] = [];

          switch (position.status) {
            case "new":
              position.status = {name: "Новое", id: "new"};
              break;
            case "pending":
              position.status = {name: "Рассмотрение", id: "pending"};
              break;
            case "calculating":
              position.status = {name: "Расчет", id: "calculating"};
              break;
            case "deffered":
              position.status = {name: "Различить", id: "deffered"};
              break;
            case "waiting":
              position.status = {name: "Ожидается", id: "waiting"};
              break;
            case "in_progress":
              position.status = {name: "В работе", id: "in_progress"};
              break;
            case "ordered":
              position.status = {name: "Заказан", id: "ordered"};
              break;
            case "done":
              position.status = {name: "Завершен", id: "done"};
              break;
            case "payed":
              position.status = {name: "Оплачен", id: "payed"};
              break;
            case "verified":
              position.status = {name: "Проверен", id: "verified"};
              break;
            default:
              break;
          };

          position.available_events.map(available_event => {
            switch (available_event) {
              case "accept":
                position_events.push({ name: "Лид", id: "accept" });
                break;
              case "start":
                position_events.push({ name: "В работе", id: "start" });
                break;
              case "put_in_wait":
                position_events.push({ name: "Ожидание", id: "put_in_wait" });
                break;
              case "calculate":
                position_events.push({ name: "Рассчет", id: "calculate" });
                break;
              case "set_ordered":
                position_events.push({ name: "Заказ", id: "set_ordered" });
                break;
              case "complete":
                position_events.push({ name: "Выполнено", id: "complete" });
                break;
              case "set_payed":
                position_events.push({ name: "Оплачено", id: "set_payed" });
                break;
              case "verify":
                position_events.push({ name: "Проверено", id: "verify" });
                break;
              default:
                break;
            };
          });

          position.available_events = position_events;

        });

        order.names = names;

      });

      let deals = result.orders.map(order => ({
        id: order.id,
        names: order.names,
        organization: order.counterparty.organization.name,
        doer: order.doer.first_name,
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