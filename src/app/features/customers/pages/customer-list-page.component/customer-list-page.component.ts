import { Component, OnInit, inject } from '@angular/core';

import { CustomersListStore } from '../state/customers-list.store';
import { CustomerFilterComponent } from '../components/customer-filter.component';
import { CustomerTableComponent } from '../components/customer-table.component';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../../shared/ui/error-alert/error-alert.component';

@Component({
  selector: 'app-customer-list-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    LoadingSpinnerComponent,
    ErrorAlertComponent,
    CustomerFilterComponent,
    CustomerTableComponent
  ],
  providers: [CustomersListStore],
  template: `
    <app-page-header
      title="Customers"
      subtitle="Enterprise-shaped Angular 21 feature with shared UI, state, data-access, detail, and edit screens."
    />

    @if (store.error(); as error) {
      <app-error-alert [message]="error" />
    }

    <app-customer-filter
      [filter]="store.filter()"
      (searchChange)="store.setSearch($event)"
      (statusChange)="store.setStatus($event)"
    />

    @if (store.loading()) {
      <app-loading-spinner />
    } @else {
      <app-customer-table
        [customers]="store.filteredCustomers()"
        (refreshClicked)="reload()"
      />
    }
  `
})
export class CustomerListPageComponent implements OnInit {
  readonly store = inject(CustomersListStore);

  ngOnInit(): void {
    void this.store.load();
  }

  reload(): void {
    void this.store.load();
  }
}