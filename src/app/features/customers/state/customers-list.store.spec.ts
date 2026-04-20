import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CustomersListStore } from './customers-list.store';
import { CustomersApiService } from '../data-access/customers-api.service';
import { Customer } from '../models/customer.models';

describe('CustomersListStore', () => {
  let store: CustomersListStore;
  let apiSpy: jasmine.SpyObj<CustomersApiService>;

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
    apiSpy = jasmine.createSpyObj<CustomersApiService>('CustomersApiService', [
      'getCustomers'
    ]);

    TestBed.configureTestingModule({
      providers: [
        CustomersListStore,
        { provide: CustomersApiService, useValue: apiSpy }
      ]
    });

    store = TestBed.inject(CustomersListStore);
  });

  it('loads customers successfully', async () => {
    apiSpy.getCustomers.and.returnValue(of(mockCustomers));

    await store.load();

    expect(apiSpy.getCustomers).toHaveBeenCalled();
    expect(store.customers()).toEqual(mockCustomers);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('sets error when load fails', async () => {
    apiSpy.getCustomers.and.returnValue(
      throwError(() => new Error('Backend failure'))
    );

    await store.load();

    expect(store.customers()).toEqual([]);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBe('Failed to load customers.');
  });

  it('filters customers by search text', async () => {
    apiSpy.getCustomers.and.returnValue(of(mockCustomers));

    await store.load();
    store.setSearch('acme');

    expect(store.filteredCustomers()).toEqual([mockCustomers[0]]);
  });

  it('filters customers by status', async () => {
    apiSpy.getCustomers.and.returnValue(of(mockCustomers));

    await store.load();
    store.setStatus('Inactive');

    expect(store.filteredCustomers()).toEqual([mockCustomers[1]]);
  });

  it('refreshes automatically every 15 seconds', fakeAsync(() => {
    apiSpy.getCustomers.and.returnValue(of(mockCustomers));

    void store.load();
    tick();

    store.startAutoRefresh(15000);

    tick(15000);
    expect(apiSpy.getCustomers).toHaveBeenCalledTimes(2);

    tick(15000);
    expect(apiSpy.getCustomers).toHaveBeenCalledTimes(3);

    store.stopAutoRefresh();
  }));

  it('does not start duplicate refresh timers', fakeAsync(() => {
    apiSpy.getCustomers.and.returnValue(of(mockCustomers));

    store.startAutoRefresh(15000);
    store.startAutoRefresh(15000);

    tick(15000);
    expect(apiSpy.getCustomers).toHaveBeenCalledTimes(1);

    store.stopAutoRefresh();
  }));

  it('stops auto refresh', fakeAsync(() => {
    apiSpy.getCustomers.and.returnValue(of(mockCustomers));

    store.startAutoRefresh(15000);
    store.stopAutoRefresh();

    tick(30000);
    expect(apiSpy.getCustomers).not.toHaveBeenCalled();
  }));

  it('does not emit a customers signal update when data is unchanged', async () => {
    apiSpy.getCustomers.and.returnValues(of(mockCustomers), of([...mockCustomers]));

    await store.load();

    let effectRuns = 0;
    TestBed.runInInjectionContext(() => {
      const { effect } = require('@angular/core');
      effect(() => {
        store.customers();
        effectRuns++;
      });
    });

    await store.load(false);

    expect(effectRuns).toBe(1);
  });

  it('does emit a customers signal update when data changes', async () => {
    const updatedCustomers: Customer[] = [
      ...mockCustomers.slice(0, 1),
      {
        ...mockCustomers[1],
        city: 'San Francisco'
      }
    ];

    apiSpy.getCustomers.and.returnValues(of(mockCustomers), of(updatedCustomers));

    await store.load();

    let effectRuns = 0;
    TestBed.runInInjectionContext(() => {
      const { effect } = require('@angular/core');
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