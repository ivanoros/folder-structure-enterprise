
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { effect } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { CustomersListStore } from './customers-list.store';
import { CustomersApiService } from '../data-access/customers-api.service';
import { Customer } from '../models/customer.models';

describe('CustomersListStore', () => {
  let store: CustomersListStore;
  let apiMock: {
    getCustomers: ReturnType<typeof vi.fn>;
  };

  const mockCustomers: Customer[] = [
    {
      id: 1,
      name: 'Acme Capital',
      city: 'New York',
      status: 'Active',
      contactEmail: 'ops@acme.com'
    },
    {
      id: 2,
      name: 'Blue River Partners',
      city: 'Chicago',
      status: 'Inactive',
      contactEmail: 'desk@blueriver.com'
    }
  ];

  beforeEach(() => {
    apiMock = {
      getCustomers: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CustomersListStore,
        { provide: CustomersApiService, useValue: apiMock }
      ]
    });

    store = TestBed.inject(CustomersListStore);
  });

  it('loads customers successfully', async () => {
    apiMock.getCustomers.mockReturnValue(of(mockCustomers));

    await store.load();

    expect(apiMock.getCustomers).toHaveBeenCalled();
    expect(store.customers()).toEqual(mockCustomers);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe(null);
  });

  it('sets error when load fails', async () => {
    apiMock.getCustomers.mockReturnValue(
      throwError(() => new Error('Backend failure'))
    );

    await store.load();

    expect(store.customers()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('Failed to load customers.');
  });

  it('filters customers by search text', async () => {
    apiMock.getCustomers.mockReturnValue(of(mockCustomers));

    await store.load();
    store.setSearch('acme');

    expect(store.filteredCustomers()).toEqual([mockCustomers[0]]);
  });

  it('filters customers by status', async () => {
    apiMock.getCustomers.mockReturnValue(of(mockCustomers));

    await store.load();
    store.setStatus('Inactive');

    expect(store.filteredCustomers()).toEqual([mockCustomers[1]]);
  });

  it('refreshes automatically every 15 seconds', fakeAsync(() => {
    apiMock.getCustomers.mockReturnValue(of(mockCustomers));

    void store.load();
    tick();

    store.startAutoRefresh(15000);

    tick(15000);
    expect(apiMock.getCustomers).toHaveBeenCalledTimes(2);

    tick(15000);
    expect(apiMock.getCustomers).toHaveBeenCalledTimes(3);

    store.stopAutoRefresh();
  }));

  it('does not start duplicate refresh timers', fakeAsync(() => {
    apiMock.getCustomers.mockReturnValue(of(mockCustomers));

    store.startAutoRefresh(15000);
    store.startAutoRefresh(15000);

    tick(15000);
    expect(apiMock.getCustomers).toHaveBeenCalledTimes(1);

    store.stopAutoRefresh();
  }));

  it('stops auto refresh', fakeAsync(() => {
    apiMock.getCustomers.mockReturnValue(of(mockCustomers));

    store.startAutoRefresh(15000);
    store.stopAutoRefresh();

    tick(30000);
    expect(apiMock.getCustomers).not.toHaveBeenCalled();
  }));

  it('does not emit a customers update when data is unchanged', async () => {
    apiMock.getCustomers
      .mockReturnValueOnce(of(mockCustomers))
      .mockReturnValueOnce(of([...mockCustomers]));

    await store.load();

    let effectRuns = 0;

    TestBed.runInInjectionContext(() => {
      effect(() => {
        store.customers();
        effectRuns++;
      });
    });

    await store.load(false);

    expect(effectRuns).toBe(1);
  });

  it('does emit a customers update when data changes', async () => {
    const updatedCustomers: Customer[] = [
      mockCustomers[0],
      {
        ...mockCustomers[1],
        city: 'San Francisco'
      }
    ];

    apiMock.getCustomers
      .mockReturnValueOnce(of(mockCustomers))
      .mockReturnValueOnce(of(updatedCustomers));

    await store.load();

    let effectRuns = 0;

    TestBed.runInInjectionContext(() => {
      effect(() => {
        store.customers();
        effectRuns++;
      });
    });

    await store.load(false);

    expect(store.customers()).toEqual(updatedCustomers);
    expect(effectRuns).toBe(2);
  });
});