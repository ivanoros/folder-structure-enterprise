import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CustomersApiService } from '../data-access/customers-api.service';
import { Customer, CustomerFilter } from '../models/customer.models';
import { areCustomersEqual } from '../../../shared/utils/ustomer.utils';

@Injectable()
export class CustomersListStore {
  private readonly api = inject(CustomersApiService);
  private readonly destroyRef = inject(DestroyRef);

  private refreshTimerId: number | null = null;

  // readonly customers = signal<Customer[]>([], {
  //   equal: (a, b) => this.areCustomersEqual(a, b)
  // });

  readonly customers = signal<Customer[]>([], {
    equal: areCustomersEqual
  });

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

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.stopAutoRefresh();
    });
  }

  async load(showLoading: boolean = true): Promise<void> {
    if (showLoading) {
      this.loading.set(true);
    }

    this.error.set(null);

    try {
      const items = await firstValueFrom(this.api.getCustomers());

      // Safe to always call set() because the signal equality function
      // prevents updates if the data is unchanged.
      this.customers.set(items);
    } catch (error) {
      console.error(error);
      this.error.set('Failed to load customers.');
    } finally {
      if (showLoading) {
        this.loading.set(false);
      }
    }
  }

  startAutoRefresh(intervalMs: number = 15000): void {
    if (this.refreshTimerId !== null) {
      return;
    }

    this.refreshTimerId = window.setInterval(() => {
      void this.load(false);
    }, intervalMs);
  }

  stopAutoRefresh(): void {
    if (this.refreshTimerId !== null) {
      window.clearInterval(this.refreshTimerId);
      this.refreshTimerId = null;
    }
  }

  setSearch(search: string): void {
    this.filter.update(current => ({ ...current, search }));
  }

  setStatus(status: CustomerFilter['status']): void {
    this.filter.update(current => ({ ...current, status }));
  }

  // private areCustomersEqual(a: Customer[], b: Customer[]): boolean {
  //   if (a === b) {
  //     return true;
  //   }

  //   if (a.length !== b.length) {
  //     return false;
  //   }

  //   for (let i = 0; i < a.length; i++) {
  //     const left = a[i];
  //     const right = b[i];

  //     if (
  //       left.id !== right.id ||
  //       left.name !== right.name ||
  //       left.city !== right.city ||
  //       left.status !== right.status ||
  //       left.contactEmail !== right.contactEmail
  //     ) {
  //       return false;
  //     }
  //   }

  //   return true;
  // }
}