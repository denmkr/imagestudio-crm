import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class PartiesService {
  constructor(private http: HttpClient) {}

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

    this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/counterparties/', party).subscribe(
      res => { console.log(res) },
      err => { console.log("Error occured") }
    );
    
    console.log("sent");
  }

  getPartiesByParams(type: string, category: string, contact: string, search: string) {
    const params = {
      kind: type,
      category: category,
      q: search
    }

    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/counterparties/")
    .map(result => {
      return result.counterparties.map(party => ({
        author: party.user.first_name,
        organization: party.organization.name,
        contact: party.contact_name,
        category: party.category,
        position: party.position,
        email: party.email,
        contact_phone: party.contact_phone,
        comment: party.comment
      }))
    });
  }

}