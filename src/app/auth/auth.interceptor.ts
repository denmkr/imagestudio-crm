import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.headers.has('InterceptorSkipHeader')) {
      const headers = request.headers.delete('InterceptorSkipHeader');
      return next.handle(request.clone({ headers }));
    }

    request = request.clone({
      setHeaders: {
        authorization: `${this.auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    return next.handle(request);
  }
}