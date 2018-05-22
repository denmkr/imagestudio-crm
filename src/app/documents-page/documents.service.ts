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

  getDocumentsByParams(category: string, contact: string, search: string, page: string) {

    let httpParams = new HttpParams();
    if (category != null && category != undefined) { httpParams = httpParams.set('category', category); }
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }
    if (page != null && page != undefined) httpParams = httpParams.set('page[number]', page);
    if (page != null && page != undefined) httpParams = httpParams.set('page[size]', '5');


    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/documents/", { params: httpParams, reportProgress: true })
    .map(result => {
      result.documents.map(document => {
        switch (document.category) {
          case "spending":
            document.category = "Расход";
            break;
          case "income":
            document.category = "Доход";
            break;
          default:
            break;
        }

        switch (document.kind) {
          case "act":
            document.kind = "Акт";
            break;
          case "layout":
            document.kind = "Макет";
            break;
          case "check":
            document.kind = "Счет";
            break;
          case "agreement":
            document.kind = "Договор";
            break;
          case "invoice":
            document.kind = "Накладная";
            break;
          case "other":
            document.kind = "Прочее";
            break;
          case "offer":
            document.kind = "Коммерческое предложение";
            break;
          default:
            break;
        }

        switch (document.status) {
          case "pending":
            document.status = "Не оплачено";
            break;
          case "complete":
            document.status = "Оплачено";
            break;
          default:
            break;
        }
      });

      let documents = result.documents.map(document => ({
        id: document.id,
        organization: document.counterparty.organization.name,
        category: document.category,
        type: document.kind,
        number: document.number,
        status: document.status,
        comment: document.comment
      }));

      return [documents, result.meta];

    });
  }

}