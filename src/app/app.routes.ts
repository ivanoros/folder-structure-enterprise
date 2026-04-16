import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'customers'
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./features/customers/routes').then(m => m.CUSTOMERS_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'customers'
  }
];