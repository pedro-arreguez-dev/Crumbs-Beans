import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { adminGuard } from '@app/core/guards/admin.guard';
import { RegisterComponent } from './pages/register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'products',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin/admin.component').then(m => AdminComponent)
  }
];