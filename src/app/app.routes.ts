import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout/main-layout.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout/login-layout.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
    ],
  },
  {
    path: 'auth',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },
  {
    path: 'checkout',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES),
      },
    ],
  },
  {
    path: 'orders',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/orders/orders.routes').then((m) => m.ORDERS_ROUTES),
      }
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
        canActivate: [adminGuard]
      }
    ]
  }
];
