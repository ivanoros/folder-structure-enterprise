import { Routes } from '@angular/router';
import { customerDetailResolver } from './resolvers/customer-detail.resolver';

export const CUSTOMERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/customer-list-page.component').then(m => m.CustomerListPageComponent)
  },
  {
    path: ':id',
    resolve: { customer: customerDetailResolver },
    loadComponent: () =>
      import('./pages/customer-detail-page.component').then(m => m.CustomerDetailPageComponent)
  },
  {
    path: ':id/edit',
    resolve: { customer: customerDetailResolver },
    loadComponent: () =>
      import('./pages/customer-edit-page.component').then(m => m.CustomerEditPageComponent)
  }
];