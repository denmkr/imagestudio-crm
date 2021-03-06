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

    return this.http.get<any>("http://backend-crm.imagestudio.su/api/v1/organizations/", { params: httpParams })
    .map(result => {
      return result.organizations.map(organization => ({
        id: organization.id,
        name: organization.name
      }))
    });
  }

  createOrganization(name: string) {
    const params = {
      name: name
    };

    return this.http.post<any>('http://backend-crm.imagestudio.su/api/v1/organizations/', params);
  }

  removeParty(id: string) {
    return this.http.delete<any>('http://backend-crm.imagestudio.su/api/v1/counterparties/' + id);
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

    return this.http.put<any>('http://backend-crm.imagestudio.su/api/v1/counterparties/' + id, party);
    
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

    return this.http.post<any>('http://backend-crm.imagestudio.su/api/v1/counterparties/', party);
    
  }

  getPartiesBySearchAndOrganization(search: string, organizationId: number) {

    let httpParams = new HttpParams();
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }
    httpParams = httpParams.set('page[number]', '1');
    httpParams = httpParams.set('page[size]', '2500');
    if (organizationId != null) httpParams = httpParams.set('organization_id', organizationId.toString());


    return this.http.get<any>("http://backend-crm.imagestudio.su/api/v1/counterparties/", { params: httpParams, reportProgress: true })
    .map(result => {

      let parties = result.counterparties.map(party => ({
        id: party.id,
        organization: party.organization,
        contact_name: party.contact_name
      }));

      return parties;
    });
  }

  getPartiesBySearch(search: string) {

    let httpParams = new HttpParams();
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }
    httpParams = httpParams.set('page[number]', '1');
    httpParams = httpParams.set('page[size]', '2500');


    return this.http.get<any>("http://backend-crm.imagestudio.su/api/v1/counterparties/", { params: httpParams, reportProgress: true })
    .map(result => {

      let parties = result.counterparties.map(party => ({
        id: party.id,
        organization: party.organization,
        contact_name: party.contact_name
      }));

      return parties;
    });
  }

  getPartiesByParams(type: string, contact: string, search: string, page: string) {

    let httpParams = new HttpParams();
    if (type != null && type != undefined) { httpParams = httpParams.set('kind', type); }
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }
    // if (category != null && category != undefined) { httpParams = httpParams.set('category', category); }
    if (page != null && page != undefined) httpParams = httpParams.set('page[number]', page);
    if (page != null && page != undefined) httpParams = httpParams.set('page[size]', '25');


    return this.http.get<any>("http://backend-crm.imagestudio.su/api/v1/counterparties/", { params: httpParams, reportProgress: true })
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
        author: party.user.first_name,
        author_id: party.user.id,
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