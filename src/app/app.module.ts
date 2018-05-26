import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng2-select';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavComponent } from './nav/nav.component';
import { PartiesPageComponent } from './parties-page/parties-page.component';
import { PartiesTableComponent } from './parties-page/parties-table/parties-table.component';
import { PartiesAddModalWindowComponent } from './parties-page/parties-add-modal-window/parties-add-modal-window.component';
import { PartiesAddFormComponent } from './parties-page/parties-add-modal-window/parties-add-form/parties-add-form.component';
import { PartiesSearchComponent } from './parties-page/parties-search/parties-search.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { TokenInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { routing } from './app.routing';
import { PartiesEditModalWindowComponent } from './parties-page/parties-edit-modal-window/parties-edit-modal-window.component';
import { PartiesEditFormComponent } from './parties-page/parties-edit-modal-window/parties-edit-form/parties-edit-form.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { PartiesTablePaginationComponent } from './parties-page/parties-table/parties-table-pagination/parties-table-pagination.component';
import { DocumentsPageComponent } from './documents-page/documents-page.component';
import { DocumentsTableComponent } from './documents-page/documents-table/documents-table.component';
import { DocumentsSearchComponent } from './documents-page/documents-search/documents-search.component';
import { DocumentsAddModalWindowComponent } from './documents-page/documents-add-modal-window/documents-add-modal-window.component';
import { DocumentsEditModalWindowComponent } from './documents-page/documents-edit-modal-window/documents-edit-modal-window.component';
import { DocumentsTablePaginationComponent } from './documents-page/documents-table/documents-table-pagination/documents-table-pagination.component';
import { DocumentsAddFormComponent } from './documents-page/documents-add-modal-window/documents-add-form/documents-add-form.component';
import { DocumentsEditFormComponent } from './documents-page/documents-edit-modal-window/documents-edit-form/documents-edit-form.component';
import { DealsPageComponent } from './deals-page/deals-page.component';
import { DealsTableComponent } from './deals-page/deals-table/deals-table.component';
import { DealsTablePaginationComponent } from './deals-page/deals-table/deals-table-pagination/deals-table-pagination.component';
import { DealsSearchComponent } from './deals-page/deals-search/deals-search.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavComponent,
    PartiesPageComponent,
    PartiesTableComponent,
    PartiesAddModalWindowComponent,
    PartiesAddFormComponent,
    PartiesSearchComponent,
    SignInPageComponent,
    PartiesEditModalWindowComponent,
    PartiesEditFormComponent,
    PartiesTablePaginationComponent,
    DocumentsPageComponent,
    DocumentsTableComponent,
    DocumentsSearchComponent,
    DocumentsAddModalWindowComponent,
    DocumentsEditModalWindowComponent,
    DocumentsTablePaginationComponent,
    DocumentsAddFormComponent,
    DocumentsEditFormComponent,
    DealsPageComponent,
    DealsTableComponent,
    DealsTablePaginationComponent,
    DealsSearchComponent
  ],
  imports: [
    LoadingBarHttpClientModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    ReactiveFormsModule,
    SelectModule,
    routing
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
