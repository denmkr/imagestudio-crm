import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class DocumentsService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  removeDocument(id: string) {
    return this.http.delete<any>('http://backend-crm.imagestudio.su/api/v1/documents/' + id);
  }

  updateDocument(id: string, type: string, category: string, status: string, counterpartyId: string, organizationId: string, orderNumber: string, url: string, 
    comment: string) {

    const document = {
      number: orderNumber,
      kind: type,
      category: category,
      counterparty: {
        id: counterpartyId
      },
      organization: {
        id: organizationId
      },
      status: status,
      url: url,
      comment: comment
    };

    return this.http.put<any>('http://backend-crm.imagestudio.su/api/v1/documents/' + id, document);
    
  }

  approveDocument(id: number) {
    return this.http.post('http://backend-crm.imagestudio.su/api/v1/documents/' + id + '/approve', null);
  }

  generateUrlForFile(name: string, type: string) {
    const file = {
      file_name: name,
      file_type: type
    };

    return this.http.post<any>('http://backend-crm.imagestudio.su/api/v1/generate_presigned_url/', file);
  }

  createNewDocument(kindId: string, categoryId: string, counterpartyId: string, organizationId: string, number: string, url: string, comment: string) {
    const document = {
      number: number,
      kind: kindId,
      category: categoryId,
      organization: {
        id: organizationId
      },
      url: url,
      comment: comment,
      counterparty: {
        id: counterpartyId
      }
    };

    return this.http.post<any>('http://backend-crm.imagestudio.su/api/v1/documents/', document);
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


    return this.http.get<any>("http://backend-crm.imagestudio.su/api/v1/documents/", { params: httpParams, reportProgress: true })
    .map(result => {

      result.documents.map(document => {

        switch (document.category) {
          case "spending":
            document.category = { id: "spending", name: "Расход" };
            break;
          case "income":
            document.category = { id: "income", name: "Доход" };
            break;
          default:
            break;
        }

        switch (document.kind) {
          case "act":
            document.kind = { id: "act", name: "Акт" };
            break;
          case "layout":
            document.kind = { id: "layout", name: "Макет" };
            break;
          case "check":
            document.kind = { id: "check", name: "Счет" };
            break;
          case "agreement":
            document.kind = { id: "agreement", name: "Договор" };
            break;
          case "invoice":
            document.kind = { id: "invoice", name: "Накладная" };
            break;
          case "other":
            document.kind = { id: "other", name: "Прочее" };
            break;
          case "commercial_proposal":
            document.kind = { id: "commercial_proposal", name: "Коммерческое предложение" };
            break;
          default:
            break;
        }

        switch (document.status) {
          case "approved":
            document.status = { id: "approve", name: "Подписано" };
            break;
          case "pending":
            document.status = { id: "pending", name: "Не подписано" };
            break;
          default:
            break;
        };

        let events: any[] = [];

        switch (document.available_event) {
          case "complete":
            events.push({ id: "approve", name: "Подписано"});
            break;
          case "pending":
            events.push({ id: "pending", name: "Не подписано"});
            break;
          default:
            break;
        };

        if (document.counterparty == null) document.counterparty = { contact_name: "" };

        if (document.status.id == "pending") events.push({ id: "pending", name: "Не подписано"});
        events.push({ id: "approve", name: "Подписано"});

        document.available_events = events;
        // document.available_events.push(document.status);

      });

      let documents = result.documents.map(document => ({
        id: document.id,
        counterparty: document.counterparty,
        organization: document.organization,
        category: document.category,
        kind: document.kind,
        number: document.number,
        url: document.url,
        status: document.status,
        comment: document.comment,
        created_at: document.created_at,
        available_events: document.available_events
      }));

      return [documents, result.meta];

    });
  }

}