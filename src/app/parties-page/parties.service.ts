import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class PartiesService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  createNewParty(type: string, category: string, organization: string, email: string, contact: string, 
    position: string, phone: string, comment: string) {

    const party = {
      kind: type,
      category: category,
      organization: {
        id: 1
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

    this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/counterparties/', party).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    );
    
    console.log("sent");
  }

  getPartiesByParams(type: string, category: string, contact: string, search: string) {

    let httpParams = new HttpParams();
    if (type != null && type != undefined) {httpParams = httpParams.set('kind', type); }
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }
    if (category != null && category != undefined) { httpParams = httpParams.set('category', category); }


    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/counterparties/", {params: httpParams})
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