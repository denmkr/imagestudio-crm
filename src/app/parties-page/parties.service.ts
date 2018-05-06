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
    .map(counterparties => {
      return counterparties.map(counterParty => {
        return {
          author: counterParty.user.first_name,
          organization: counterParty.organization.name,
          contact: counterParty.contact_name,
          category: counterParty.category,
          position: counterParty.position,
          email: counterParty.email,
          contact_phone: counterParty.contact_phone,
          comment: counterParty.comment,
        }
      })
    });
  }

}