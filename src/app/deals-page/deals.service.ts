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
        organization: order.counterparty.organization,
        counterparty: order.counterparty,
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

  editDealById(id: string, deadline: string, doer_id: string, counterparty_id: string, comment: string, orders_positions: Array<any>, documents: Array<any>) {

    documents.map(document => {
      document.kind = document.kind.id;
      document.category = document.category.id;
      document.counterparty = {
        id: document.counterparty.id
      };
    });

    orders_positions.map(orders_position => {
      const order = {
        id: id
      };

      orders_position.order = order;
      let orders_position_id = orders_position.id;

      orders_position.orders_items.map(orders_item => {
        const orders_position = {
          id: orders_position_id
        }

        orders_item.orders_position = orders_position;
      });
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
      documents: documents
    };

    console.log(order);

    this.http.put('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders/' + id, order).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    );
  }

  createNewDeal(deadline: string, doer_id: string, counterparty_id: string, comment: string, orders_positions: Array<any>, documents: Array<any>) {
 
    const order = {
      must_be_finished_at: deadline,
      doer: {
        id: doer_id
      },
      counterparty: {
        id: counterparty_id
      },
      comment: comment,
      orders_positions: orders_positions,
      documents: documents
    };

    this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders/', order).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    );
    
  }

  editPositionById(id: number, deadline: string, product_id: number, order_id: number, price: string, count: string) {
    const order_position = {
      product: {
        id: product_id
      },
      order: {
        id: order_id
      },
      must_be_finished_at: deadline,
      price: price,
      count: count
    };

    return this.http.put('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders_positions/' + id, order_position);
  }

  createNewPosition(deadline: string, product_id: number, order_id: number, price: string, count: string) {
    const order_position = {
      product: {
        id: product_id
      },
      order: {
        id: order_id
      },
      must_be_finished_at: deadline,
      price: price,
      count: count
    };

    this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders_positions/', order_position).subscribe(
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

  getDealById(id: string) {
    return this.http.get<any>('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/orders/' + id)
    .map(result => {
      let available_events = [];

      result.order.available_events.map(available_event => {
        switch (available_event) {
          case "accept":
            available_events.push({ name: "Лид", id: "accept" });
            break;
          case "start":
            available_events.push({ name: "В работе", id: "start" });
            break;
          case "complete":
            available_events.push({ name: "Выполнено", id: "complete" });
            break;
          case "set_payed":
            available_events.push({ name: "Оплачено", id: "set_payed" });
            break;
          case "archive":
            available_events.push({ name: "Архив", id: "archive" });
            break;
          case "deny":
            available_events.push({ name: "Слив", id: "deny" });
            break;
          default:
            break;
        };
      });

      switch (result.order.status) {
        case "new":
          result.order.status = {name: "Новое", id: "new"};
          break;
        case "lead":
          result.order.status = {name: "Лид", id: "lead"};
          break;
        case "in_progress":
          result.order.status = {name: "В работе", id: "in_progress"};
          break;
        case "payed":
          result.order.status = {name: "Оплачено", id: "payed"};
          break;
        case "done":
          result.order.status = {name: "Выполнено", id: "done"};
          break;
        case "archived":
          result.order.status = {name: "Архив", id: "archived"};
          break;
        case "denied":
          result.order.status = {name: "Слив", id: "denied"};
          break;
        default:
          break;
      };

      available_events.push({ name: result.order.status.name, id: result.order.status.id});

      result.order.orders_positions.map(position => {
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

        position_events.push({ name: position.status.name, id: position.status.id});
        position.available_events = position_events;
        
      });

      result.order.documents.map(document => {
        switch (document.category) {
          case "spending":
            document.category = { id: "spending", name: "Расход" };
            break;
          case "income":
            document.category = { id: "income", name: "Доход" };
            break;
          default:
            break;
        }

        switch (document.kind) {
          case "act":
            document.kind = { id: "act", name: "Акт" };
            break;
          case "layout":
            document.kind = { id: "layout", name: "Макет" };
            break;
          case "check":
            document.kind = { id: "check", name: "Счет" };
            break;
          case "agreement":
            document.kind = { id: "agreement", name: "Договор" };
            break;
          case "invoice":
            document.kind = { id: "invoice", name: "Накладная" };
            break;
          case "other":
            document.kind = { id: "other", name: "Прочее" };
            break;
          case "commercial_proposal":
            document.kind = { id: "commercial_proposal", name: "Коммерческое предложение" };
            break;
          default:
            break;
        }

        switch (document.status) {
          case "complete":
            document.status = { id: "complete", name: "Оплачено" };
            break;
          case "pending":
            document.status = { id: "pending", name: "Не оплачено" };
            break;
          default:
            break;
        };

        let events: any[] = [];

        switch (document.available_event) {
          case "complete":
            events.push({ id: "complete", name: "Оплачено"});
            break;
          case "pending":
            events.push({ id: "pending", name: "Не оплачено"});
            break;
          default:
            break;
        };

        document.available_events = events;
        document.available_events.push(document.status);

        // document.counterparty = document.counterparty.id;

      });

      let order = {
        doer: result.order.doer,
        comment: result.order.comment,
        must_be_finished_at: result.order.must_be_finished_at,
        status: result.order.status,
        counterparty: result.order.counterparty,
        available_events: available_events,
        documents: result.order.documents,
        orders_positions: result.order.orders_positions
      };

      return order;
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
        full_price: order.full_price,
        prime_price: order.prime_price,
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