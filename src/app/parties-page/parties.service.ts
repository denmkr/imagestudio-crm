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

  getPartiesByParams(type: string, category: string, contact: string, search: string) {
    const params = {
      type: type,
      category: category,
      contact: search
    }

    return this.http.get("https://api.crm.badygin.ru/counterparties", { params: params })
    .map(response => response.json())
    .map(response => response.results)
    .map(parties => {
      return parties.map(party => {
        return {
          author: party.author.username,
          organization: party.organization,
          contact: party.contact,
          category: party.category,
          position: party.position,
          email: party.email,
          contact_phone: party.contact_phone,
          comment: party.comment,
        }
      })
    });
  }

}