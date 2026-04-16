import { Routes } from '@angular/router';
import { AppShellComponent } from './core/layout/app-shell/app-shell.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'customers'
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./features/customers/routes').then(m => m.CUSTOMERS_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'customers'
  }
];