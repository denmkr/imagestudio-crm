import { Routes, RouterModule } from '@angular/router';
 
import { HomePageComponent } from './home-page/home-page.component';
import { PartiesPageComponent } from './parties-page/parties-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { AuthGuard } from './auth/auth.guard';

const routes = [
  { path: '', redirectTo: "/home", pathMatch: 'full' },
  { path: 'parties', component: PartiesPageComponent, canActivate: [AuthGuard], data: { animation: 'page1' } },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard], data: { animation: 'page2' } },
  { path: 'signin', component: SignInPageComponent }
];

export const routing = RouterModule.forRoot(routes);