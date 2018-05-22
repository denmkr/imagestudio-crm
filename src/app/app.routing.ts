import { Routes, RouterModule } from '@angular/router';
 
import { HomePageComponent } from './home-page/home-page.component';
import { PartiesPageComponent } from './parties-page/parties-page.component';
import { DocumentsPageComponent } from './documents-page/documents-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { AuthGuard } from './auth/auth.guard';

const routes = [
  { path: '', redirectTo: "/home", pathMatch: 'full' },
  { path: 'parties', component: PartiesPageComponent, canActivate: [AuthGuard] },
  { path: 'documents', component: DocumentsPageComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: SignInPageComponent }
];

export const routing = RouterModule.forRoot(routes);