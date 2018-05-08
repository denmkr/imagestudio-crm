import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { fadeAnimation } from './animations/fade.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeAnimation]
})
export class AppComponent {

	private isAuth: boolean;

	constructor(private authService: AuthService) { }

	ngOnInit() { 

	}

	refresh() {
	    this.isAuth = this.authService.isAuthenticated();
	}

	public getRouterOutletState(outlet) {
	    return outlet.isActivated ? outlet.activatedRoute : '';
	  }

}
