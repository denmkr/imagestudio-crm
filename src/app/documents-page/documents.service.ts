import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class DocumentsService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  removeDocument(id: string) {
    this.http.delete('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/documents/' + id).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    ); 
  }

  updateDocument(id: string, type: string, category: string, organization: string, email: string, contact: string, 
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

    this.http.put('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/documents/' + id, document).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    );
    
  }

  createNewDocument(type: string, category: string, counterparty: string, comment: string) {

    const document = {
      kind: type,
      category: category,
      counterparty: counterparty,
      comment: comment,
      user: {
        id: this.authService.getUserId()
      }
    };

    this.http.post('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/documents/', document).subscribe(
      res => { console.log(res) },
      err => { console.log(err) }
    );
    
  }

  getDocumentsByParams(type: string, contact: string, search: string, page: string) {

    let httpParams = new HttpParams();
    if (type != null && type != undefined) { httpParams = httpParams.set('kind', type); }
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }
    if (page != null && page != undefined) httpParams = httpParams.set('page[number]', page);
    if (page != null && page != undefined) httpParams = httpParams.set('page[size]', '15');


    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/documents/", { params: httpParams, reportProgress: true })
    .map(result => {
      result.documents.map(document => {
        switch (document.category) {
          case "state":
            document.category = "Государство";
            break;
          case "business":
            document.category = "Бизнес";
            break;
          case "individual":
            document.category = "Частное лицо";
            break;
          default:
            break;
        }
      });

      let documents = result.documents.map(document => ({
        id: document.id,
        author: document.user.first_name + " " + document.user.last_name,
        organization: document.organization.name,
        contact: document.contact_name,
        category: document.category,
        position: document.position,
        email: document.email,
        contact_phone: document.contact_phone,
        comment: document.comment
      }));

      return [documents, result.meta];

    });
  }

}