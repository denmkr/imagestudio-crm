import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	private isAuth: boolean;

	constructor(private authService: AuthService) { }

	ngOnInit() { 
	}

	refresh() {
	    this.isAuth = this.authService.isAuthenticated();
	}

}
