import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavComponent } from './nav/nav.component';

const routes = [
  {
    path: '',
    redirectTo: "/home",
    pathMatch: 'full'
  },
  { path: 'home', component: HomePageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
