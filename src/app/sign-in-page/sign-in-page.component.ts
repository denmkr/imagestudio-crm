import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.css'],
  providers: [ AuthService ]
})
export class SignInPageComponent implements OnInit {

  public isAuth: boolean;

  public inputs = [
    {name: "email", type: "email", placeholder: "pupinastar@imagestudio.su", title: "Email"},
    {name: "password", type: "password", placeholder: "Пароль", title: "Пароль"}
  ];

  signInForm: FormGroup;
  email: FormControl;
  password: FormControl;

  constructor(public formbuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  signIn(event) {
    if (this.signInForm.controls.email.valid) {
  	  this.authService.signIn(this.signInForm.get("email").value, this.signInForm.get("password").value)
      .subscribe(
        result => this.router.navigate(['/']),
        error => this.router.navigate(['/'])
      );
    }
  }

  signOut() {
    this.authService.signOut();
    this.isAuth = this.authService.isAuthenticated();
  }

  ngOnInit() {
    this.isAuth = this.authService.isAuthenticated();

  	this.email = new FormControl("", [
  	  Validators.required, 
  	  Validators.pattern("[^ @]*@[^ @]*")
  	]);
    this.password = new FormControl('', [
      Validators.required
    ]);
   
  	this.signInForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

}
