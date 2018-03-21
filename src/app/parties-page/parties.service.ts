import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class PartiesService {
  constructor(private http: Http) {}

  createNewParty(type: string, category: string, organization: string, email: string, contact: string, 
    position: string, phone: string, comment: string) {

    const party = {
      type: type,
      category: category,
      organization: organization,
      email: email,
      contact: contact,
      position: position,
      phone: phone,
      comment: comment
    };

    this.http.post('https://api.crm.badygin.ru/counterparties/', party).subscribe(
      res => { console.log(res) },
      err => { console.log("Error occured") }
    );
    
    console.log("sent");
  }

  getPartiesBySearch(search: string) {
    const parameters = {
      format: "json",
      search: search
    }

    return this.http.get("https://api.crm.badygin.ru/counterparties/", parameters)
    .map(response => response.json())
    .map(response => response.results)
    .map(users => {
      return users.map(user => {
        return {
          organization: user.organization,
          contact: user.contact,
          email: user.email,
          contact_phone: user.contact_phone,
          comment: user.comment,
        }
      })
    });
  }

  getAllParties() {
  	return this.http.get("https://api.crm.badygin.ru/counterparties/?format=json")
    .map(response => response.json())
    .map(response => response.results)
    .map(users => {
      return users.map(user => {
        return {
          organization: user.organization,
          contact: user.contact,
          email: user.email,
          contact_phone: user.contact_phone,
          comment: user.comment,
        }
      })
    });
  }

  getPartnersParties() {
    return this.http.get("https://api.crm.badygin.ru/counterparties/?format=json")
    .map(response => response.json())
    .map(response => response.results)
    .map(users => {
      return users.filter(user => user.type === "partner").map(user => {
        return {
          organization: user.organization,
          contact: user.contact,
          email: user.email,
          contact_phone: user.contact_phone,
          comment: user.comment,
        }
      })
    });
  }

  getClientsParties() {
    return this.http.get("https://api.crm.badygin.ru/counterparties/?format=json")
    .map(response => response.json())
    .map(response => response.results)
    .map(users => {
      return users.filter(user => user.type === "client").map(user => {
        return {
          organization: user.organization,
          contact: user.contact,
          email: user.email,
          contact_phone: user.contact_phone,
          comment: user.comment,
        }
      })
    });
  }

}