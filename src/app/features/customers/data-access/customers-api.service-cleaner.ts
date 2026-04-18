import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of } from 'rxjs';

import { Customer, CustomerDto, UpdateCustomerRequest } from '../models/customer.models';
import { mapCustomerDto } from './customer.mapper';

@Injectable({ providedIn: 'root' })
export class CustomersApiService {
  private readonly http = inject(HttpClient);

  private readonly customersJsonUrl = '/mock-data/customers.json';

  private loadCustomerDtos(): Observable<CustomerDto[]> {
    return this.http.get<CustomerDto[]>(this.customersJsonUrl);
  }

  getCustomers(): Observable<Customer[]> {
    return this.loadCustomerDtos().pipe(
      map(items => items.map(mapCustomerDto))
    );
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.loadCustomerDtos().pipe(
      map(items => {
        const dto = items.find(x => x.id === id);

        if (!dto) {
          throw new Error(`Customer ${id} not found`);
        }

        return mapCustomerDto(dto);
      })
    );
  }

  updateCustomer(id: number, request: UpdateCustomerRequest): Observable<Customer> {
    return of({
      id,
      name: request.name,
      city: request.city,
      status: request.status,
      contactEmail: request.contactEmail
    }).pipe(delay(300));
  }
}