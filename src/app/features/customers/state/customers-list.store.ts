import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CustomersApiService } from '../data-access/customers-api.service';
import { Customer, CustomerFilter } from '../models/customer.models';

@Injectable()
export class CustomersListStore {
  private readonly api = inject(CustomersApiService);

  readonly customers = signal<Customer[]>([]);
  readonly selectedCustomer = signal<Customer | null>(null);

  readonly loading = signal(false);
  readonly loadingCustomer = signal(false);

  readonly error = signal<string | null>(null);
  readonly customerError = signal<string | null>(null);

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

  async loadCustomerById(id: number): Promise<void> {
    this.loadingCustomer.set(true);
    this.customerError.set(null);
    this.selectedCustomer.set(null);

    try {
      const customer = await firstValueFrom(this.api.getCustomerById(id));
      this.selectedCustomer.set(customer);
    } catch (error) {
      console.error(error);
      this.customerError.set(`Failed to load customer ${id}.`);
    } finally {
      this.loadingCustomer.set(false);
    }
  }

  clearSelectedCustomer(): void {
    this.selectedCustomer.set(null);
    this.customerError.set(null);
  }

  setSearch(search: string): void {
    this.filter.update(current => ({
      ...current,
      search
    }));
  }

  setStatus(status: CustomerFilter['status']): void {
    this.filter.update(current => ({
      ...current,
      status
    }));
  }
}