import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng2-select';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavComponent } from './nav/nav.component';
import { PartiesPageComponent } from './parties-page/parties-page.component';
import { PartiesTableComponent } from './parties-page/parties-table/parties-table.component';
import { PartiesAddModalWindowComponent } from './parties-page/parties-add-modal-window/parties-add-modal-window.component';
import { PartiesAddFormComponent } from './parties-page/parties-add-modal-window/parties-add-form/parties-add-form.component';

const routes = [
  {
    path: '',
    redirectTo: "/home",
    pathMatch: 'full'
  },
  { path: 'parties', component: PartiesPageComponent },
  { path: 'home', component: HomePageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavComponent,
    PartiesPageComponent,
    PartiesTableComponent,
    PartiesAddModalWindowComponent,
    PartiesAddFormComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    SelectModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
