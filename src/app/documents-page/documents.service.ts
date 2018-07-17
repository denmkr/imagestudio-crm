import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class DocumentsService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  removeDocument(id: string) {
    return this.http.delete<any>('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/documents/' + id);
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

  generateUrlForFile(name: string, type: string) {
    const file = {
      file_name: name,
      file_type: type
    };

    return this.http.post<any>('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/generate_presigned_url/', file);
  }

  createNewDocument(type: string, category: string, counterparty: string, orderNumber: string, url: string, comment: string) {
    const document = {
      number: orderNumber,
      kind: type,
      category: category,
      url: url,
      comment: comment,
      counterparty: {
        id: counterparty
      }
    };

    return this.http.post<any>('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/documents/', document);
  }

  uploadfileAWSS3(presignedUrl: string, contentType: string, file: File) { 
    let httpHeaders = new HttpHeaders({'Content-Type': contentType});
    httpHeaders = httpHeaders.set('InterceptorSkipHeader', '');

    return this.http.put<any>(presignedUrl, file, { headers: httpHeaders });
  }

  getDocumentsByParams(category: string, contact: string, search: string, page: string) {

    let httpParams = new HttpParams();
    if (category != null && category != undefined) { httpParams = httpParams.set('category', category); }
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }
    if (page != null && page != undefined) httpParams = httpParams.set('page[number]', page);
    if (page != null && page != undefined) httpParams = httpParams.set('page[size]', '25');


    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/documents/", { params: httpParams, reportProgress: true })
    .map(result => {
      result.documents.map(document => {
        switch (document.category) {
          case "spending":
            document.categoryName = "Расход";
            break;
          case "income":
            document.categoryName = "Доход";
            break;
          default:
            break;
        }

        switch (document.kind) {
          case "act":
            document.kindName = "Акт";
            break;
          case "layout":
            document.kindName = "Макет";
            break;
          case "check":
            document.kindName = "Счет";
            break;
          case "agreement":
            document.kindName = "Договор";
            break;
          case "invoice":
            document.kindName = "Накладная";
            break;
          case "other":
            document.kindName = "Прочее";
            break;
          case "commercial_proposal":
            document.kindName = "Коммерческое предложение";
            break;
          default:
            break;
        }

        switch (document.status) {
          case "pending":
            document.statusName = "Не оплачено";
            break;
          case "complete":
            document.statusName = "Оплачено";
            break;
          default:
            break;
        }
      });

      let documents = result.documents.map(document => ({
        id: document.id,
        organization: document.counterparty.organization.name,
        counterparty: document.counterparty.contact_name,
        counterparty_id: document.counterparty.id,
        categoryName: document.categoryName,
        category: document.category,
        typeName: document.kindName,
        type: document.kind,
        number: document.number,
        statusName: document.statusName,
        comment: document.comment,
        date: document.created_at
      }));

      return [documents, result.meta];

    });
  }

}