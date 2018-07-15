import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class PartiesService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getOrganizations(search) {
    let httpParams = new HttpParams();
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }

    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/organizations/", { params: httpParams })
    .map(result => {
      return result.organizations.map(organization => ({
        id: organization.id,
        text: organization.name
      }))
    });
  }

  createOrganization(name: string) {
    const params = {
      name: name
    };

    return this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/organizations/', params);
  }

  removeParty(id: string) {
    this.http.delete('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/counterparties/' + id).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    ); 
  }

  updateParty(id: string, type: string, category: string, organization: string, email: string, contact: string, 
    position: string, phone: string, comment: string) {

    const party = {
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

    return this.http.put('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/counterparties/' + id, party);
    
  }

  createNewParty(type: string, category: string, organization: string, email: string, contact: string, 
    position: string, phone: string, comment: string) {

    const party = {
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

    return this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/counterparties/', party);
    
  }

  getPartiesByParams(type: string, contact: string, search: string, page: string) {

    let httpParams = new HttpParams();
    if (type != null && type != undefined) { httpParams = httpParams.set('kind', type); }
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }
    // if (category != null && category != undefined) { httpParams = httpParams.set('category', category); }
    if (page != null && page != undefined) httpParams = httpParams.set('page[number]', page);
    if (page != null && page != undefined) httpParams = httpParams.set('page[size]', '15');


    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/counterparties/", { params: httpParams, reportProgress: true })
    .map(result => {
      result.counterparties.map(party => {
        switch (party.category) {
          case "state":
            party.categoryName = "Государство";
            break;
          case "business":
            party.categoryName = "Бизнес";
            break;
          case "individual":
            party.categoryName = "Частное лицо";
            break;
          default:
            break;
        }
      });

      let parties = result.counterparties.map(party => ({
        id: party.id,
        author: party.user.first_name
        organization: party.organization.name,
        organization_id: party.organization.id,
        contact: party.contact_name,
        type: party.kind,
        category: party.category,
        categoryName: party.categoryName,
        position: party.position,
        email: party.email,
        contact_phone: party.contact_phone,
        comment: party.comment
      }));

      return [parties, result.meta];

    });
  }

}