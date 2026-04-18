import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CustomersApiService } from '../data-access/customers-api.service-hardcoded';
import { Customer, CustomerFilter } from '../models/customer.models';

@Injectable()
export class CustomersListStore {
  private readonly api = inject(CustomersApiService);

  readonly customers = signal<Customer[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly filter = signal<CustomerFilter>({
    search: '',
    status: 'All'
  });

  readonly filteredCustomers = computed(() => {
    const search = this.filter().search.trim().toLowerCase();
    const status = this.filter().status;

    return this.customers().filter(customer => {
      const matchesSearch =
        !search ||
        customer.name.toLowerCase().includes(search) ||
        customer.city.toLowerCase().includes(search) ||
        customer.contactEmail.toLowerCase().includes(search);

      const matchesStatus =
        status === 'All' || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const items = await firstValueFrom(this.api.getCustomers());
      this.customers.set(items);
    } catch (error) {
      console.error(error);
      this.error.set('Failed to load customers.');
    } finally {
      this.loading.set(false);
    }
  }

  setSearch(search: string): void {
    this.filter.update(current => ({ ...current, search }));
  }

  setStatus(status: CustomerFilter['status']): void {
    this.filter.update(current => ({ ...current, status }));
  }
}