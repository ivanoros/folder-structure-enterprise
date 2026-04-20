import { Component, OnInit, inject } from '@angular/core';

import { CustomersListStore } from '../../state/customers-list.store';
import { CustomerFilterComponent } from '../../components/customer-filter/customer-filter.component';
import { CustomerTableComponent } from '../../components/customer-table/customer-table.component';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../../../shared/ui/error-alert/error-alert.component';

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
  templateUrl: './customer-list-page.component.html',
  styleUrl: './customer-list-page.component.css'
})
export class CustomerListPageComponent implements OnInit {
  readonly store = inject(CustomersListStore);

  async ngOnInit(): Promise<void> {
    await this.store.load();
    this.store.startAutoRefresh(15000);
  }

  reload(): void {
    void this.store.load();
  }
}