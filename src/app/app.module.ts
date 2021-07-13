import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*import { SelectModule } from 'ng2-select';*/
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2CloudinaryModule } from 'ng2-cloudinary';
import { FileUploadModule } from 'ng2-file-upload';

import { OnlyNumberDirective } from './directives/only-number.directive';
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
import { DealsCreatingComponent } from './deals-page/deals-creating/deals-creating.component';
import { DealsCreatingFormComponent } from './deals-page/deals-creating/deals-creating-form/deals-creating-form.component';
import { DealsColumnsComponent } from './deals-page/deals-columns/deals-columns.component';
import { DealsPositionsAddModalWindowComponent } from './deals-page/deals-creating/deals-creating-form/deals-positions-add-modal-window/deals-positions-add-modal-window.component';
import { DealsItemsAddModalWindowComponent } from './deals-page/deals-creating/deals-creating-form/deals-positions-add-modal-window/deals-positions-add-form/deals-items-add-modal-window/deals-items-add-modal-window.component';
import { DealsPositionsAddFormComponent } from './deals-page/deals-creating/deals-creating-form/deals-positions-add-modal-window/deals-positions-add-form/deals-positions-add-form.component';
import { DealsItemsAddFormComponent } from './deals-page/deals-creating/deals-creating-form/deals-positions-add-modal-window/deals-positions-add-form/deals-items-add-modal-window/deals-items-add-form/deals-items-add-form.component';
import { WarehousePageComponent } from './warehouse-page/warehouse-page.component';
import { DesignPageComponent } from './design-page/design-page.component';
import { DesignTableComponent } from './design-page/design-table/design-table.component';
import { DesignTablePaginationComponent } from './design-page/design-table/design-table-pagination/design-table-pagination.component';
import { DesignSearchComponent } from './design-page/design-search/design-search.component';
import { DesignColumnsComponent } from './design-page/design-columns/design-columns.component';
import { DesignCreatingComponent } from './design-page/design-creating/design-creating.component';
import { DesignCreatingFormComponent } from './design-page/design-creating/design-creating-form/design-creating-form.component';
import { DesignPositionsAddModalWindowComponent } from './design-page/design-creating/design-creating-form/design-positions-add-modal-window/design-positions-add-modal-window.component';
import { DesignPositionsAddFormComponent } from './design-page/design-creating/design-creating-form/design-positions-add-modal-window/design-positions-add-form/design-positions-add-form.component';
import { DesignItemsAddModalWindowComponent } from './design-page/design-creating/design-creating-form/design-positions-add-modal-window/design-positions-add-form/design-items-add-modal-window/design-items-add-modal-window.component';
import { DesignItemsAddFormComponent } from './design-page/design-creating/design-creating-form/design-positions-add-modal-window/design-positions-add-form/design-items-add-modal-window/design-items-add-form/design-items-add-form.component';
import { DealsEditingComponent } from './deals-page/deals-editing/deals-editing.component';
import { DealsEditingFormComponent } from './deals-page/deals-editing/deals-editing-form/deals-editing-form.component';
import { DealsPositionsEditModalWindowComponent } from './deals-page/deals-editing/deals-editing-form/deals-positions-edit-modal-window/deals-positions-edit-modal-window.component';
import { DealsPositionsEditFormComponent } from './deals-page/deals-editing/deals-editing-form/deals-positions-edit-modal-window/deals-positions-edit-form/deals-positions-edit-form.component';
import { DealsItemsEditModalWindowComponent } from './deals-page/deals-editing/deals-editing-form/deals-positions-edit-modal-window/deals-positions-edit-form/deals-items-edit-modal-window/deals-items-edit-modal-window.component';
import { DealsItemsEditFormComponent } from './deals-page/deals-editing/deals-editing-form/deals-positions-edit-modal-window/deals-positions-edit-form/deals-items-edit-modal-window/deals-items-edit-form/deals-items-edit-form.component';

import { NgDatepickerModule } from 'ng2-datepicker';
import { DealsPositionsCreatingModalWindowComponent } from './deals-page/deals-editing/deals-editing-form/deals-positions-creating-modal-window/deals-positions-creating-modal-window.component';
import { DealsPositionsCreatingFormComponent } from './deals-page/deals-editing/deals-editing-form/deals-positions-creating-modal-window/deals-positions-creating-form/deals-positions-creating-form.component';
import { OrdersPageComponent } from './orders-page/orders-page.component';
import { OrdersTableComponent } from './orders-page/orders-table/orders-table.component';
import { OrdersTablePaginationComponent } from './orders-page/orders-table/orders-table-pagination/orders-table-pagination.component';
import { OrdersColumnsComponent } from './orders-page/orders-columns/orders-columns.component';
import { OrdersSearchComponent } from './orders-page/orders-search/orders-search.component';
import { OrdersCreateComponent } from './orders-page/orders-create/orders-create.component';
import { OrdersPositionCreateModalComponent } from './orders-page/orders-create/orders-position-create-modal/orders-position-create-modal.component';
import { OrdersPositionCreateFormComponent } from './orders-page/orders-create/orders-position-create-modal/orders-position-create-form/orders-position-create-form.component';
import { OrdersItemCreateModalComponent } from './orders-page/orders-create/orders-item-create-modal/orders-item-create-modal.component';
import { OrdersItemCreateFormComponent } from './orders-page/orders-create/orders-item-create-modal/orders-item-create-form/orders-item-create-form.component';
import { OrdersEditComponent } from './orders-page/orders-edit/orders-edit.component';
import { OrdersPositionEditModalComponent } from './orders-page/orders-edit/orders-position-edit-modal/orders-position-edit-modal.component';
import { OrdersPositionEditFormComponent } from './orders-page/orders-edit/orders-position-edit-modal/orders-position-edit-form/orders-position-edit-form.component';
import { OrdersItemEditModalComponent } from './orders-page/orders-edit/orders-item-edit-modal/orders-item-edit-modal.component';
import { OrdersItemEditFormComponent } from './orders-page/orders-edit/orders-item-edit-modal/orders-item-edit-form/orders-item-edit-form.component';

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
    DealsSearchComponent,
    DealsCreatingComponent,
    DealsCreatingFormComponent,
    OnlyNumberDirective,
    DealsColumnsComponent,
    DealsPositionsAddModalWindowComponent,
    DealsItemsAddModalWindowComponent,
    DealsPositionsAddFormComponent,
    DealsItemsAddFormComponent,
    WarehousePageComponent,
    DesignPageComponent,
    DesignTableComponent,
    DesignTablePaginationComponent,
    DesignSearchComponent,
    DesignColumnsComponent,
    DesignCreatingComponent,
    DesignCreatingFormComponent,
    DesignPositionsAddModalWindowComponent,
    DesignPositionsAddFormComponent,
    DesignItemsAddModalWindowComponent,
    DesignItemsAddFormComponent,
    DealsEditingComponent,
    DealsEditingFormComponent,
    DealsPositionsEditModalWindowComponent,
    DealsPositionsEditFormComponent,
    DealsItemsEditModalWindowComponent,
    DealsItemsEditFormComponent,
    DealsPositionsCreatingModalWindowComponent,
    DealsPositionsCreatingFormComponent,
    OrdersPageComponent,
    OrdersTableComponent,
    OrdersTablePaginationComponent,
    OrdersColumnsComponent,
    OrdersSearchComponent,
    OrdersCreateComponent,
    OrdersPositionCreateModalComponent,
    OrdersPositionCreateFormComponent,
    OrdersItemCreateModalComponent,
    OrdersItemCreateFormComponent,
    OrdersEditComponent,
    OrdersPositionEditModalComponent,
    OrdersPositionEditFormComponent,
    OrdersItemEditModalComponent,
    OrdersItemEditFormComponent
  ],
  imports: [
    LoadingBarHttpClientModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    ReactiveFormsModule,
    Ng2CloudinaryModule,
    /*SelectModule,*/
    NgSelectModule,
    FileUploadModule,
    NgDatepickerModule,

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
