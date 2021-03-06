import { Routes, RouterModule } from '@angular/router';
 
import { HomePageComponent } from './home-page/home-page.component';
import { PartiesPageComponent } from './parties-page/parties-page.component';
import { DocumentsPageComponent } from './documents-page/documents-page.component';
import { DealsPageComponent } from './deals-page/deals-page.component';
import { OrdersPageComponent } from './orders-page/orders-page.component';
import { OrdersCreateComponent } from './orders-page/orders-create/orders-create.component';
import { OrdersEditComponent } from './orders-page/orders-edit/orders-edit.component';
import { DesignPageComponent } from './design-page/design-page.component';
import { DesignCreatingComponent } from './design-page/design-creating/design-creating.component';
import { DealsCreatingComponent } from './deals-page/deals-creating/deals-creating.component';
import { DealsEditingComponent } from './deals-page/deals-editing/deals-editing.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { AuthGuard } from './auth/auth.guard';

const routes = [
  { path: '', redirectTo: "/home", pathMatch: 'full' },
  { path: 'parties', component: PartiesPageComponent, canActivate: [AuthGuard] },
  { path: 'documents', component: DocumentsPageComponent, canActivate: [AuthGuard] },
  { path: 'design', component: DesignPageComponent, canActivate: [AuthGuard] },
  { path: 'design/create', component: DesignCreatingComponent, canActivate: [AuthGuard] },
  { path: 'deals', component: DealsPageComponent, canActivate: [AuthGuard] },
  { path: 'deals/create', component: DealsCreatingComponent, canActivate: [AuthGuard] },
  { path: 'deals/edit', component: DealsEditingComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersPageComponent, canActivate: [AuthGuard] },
  { path: 'orders/create', component: OrdersCreateComponent, canActivate: [AuthGuard] },
  { path: 'orders/edit', component: OrdersEditComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: SignInPageComponent }
];

export const routing = RouterModule.forRoot(routes);