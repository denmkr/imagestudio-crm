import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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

	constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
    }

	refresh() {
	    this.isAuth = this.authService.isAuthenticated();
	}

	public getRouterOutletState(outlet) {
	    return outlet.isActivated ? outlet.activatedRoute : '';
	}

}
