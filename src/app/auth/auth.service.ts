import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from "rxjs/Rx"
import 'rxjs/add/operator/map';
import { User } from './user.model';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  public signIn(email: string, password: string) {

    const userData = {
      email: email,
      password: password
    };

    return this.http.post<any>('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/authentication/login/', userData)
    .map(response => {
        if (response.status != 401) {
          localStorage.setItem('firstName', response.user_data.first_name);
	      	localStorage.setItem('token', response.token);
 		    }
    });
   
  }

  public signOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

  public isAuthenticated(): boolean {
    if (localStorage.getItem('token')) {
    	return true;
    }
    return false;
  }

  public getAccountName(): string {
  	return "Denis";
  }

  public getToken(): string {
  	return localStorage.getItem('token');
  }

}