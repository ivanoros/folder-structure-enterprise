import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';

import { Customer, CustomerDto, UpdateCustomerRequest } from '../models/customer.models';
import { mapCustomerDto } from './customer.mapper';

@Injectable({ providedIn: 'root' })
export class CustomersApiService {
  private readonly http = inject(HttpClient);

  getCustomers(): Observable<Customer[]> {
    // Example real version:
    // return this.http.get<CustomerDto[]>('/customers').pipe(
    //   map(items => items.map(mapCustomerDto))
    // );

    return of<CustomerDto[]>([
      { id: 1, name: 'Acme Capital', city: 'New York', isActive: true, email: 'ops@acme.com' },
      { id: 2, name: 'Blue River Partners', city: 'Chicago', isActive: false, email: 'desk@blueriver.com' },
      { id: 3, name: 'Northwind Trading', city: 'Boston', isActive: true, email: 'support@northwind.com' }
    ]).pipe(
      delay(300),
      map(items => items.map(mapCustomerDto))
    );
  }

  getCustomer(id: number): Observable<Customer> {
    return this.getCustomers().pipe(
      map(items => {
        const customer = items.find(x => x.id === id);
        if (!customer) {
          throw new Error(`Customer ${id} not found`);
        }
        return customer;
      })
    );
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<CustomerDto>(`/customers/${id}`).pipe(
      map(mapCustomerDto),
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => new Error('Customer not found'));
        }
        return throwError(() => error);
      })
    );
  }
  
  getCustomerById1(id: number): Observable<Customer> {
    return of<CustomerDto>({
      id: 1,
      name: 'Acme Capital',
      city: 'New York',
      isActive: true,
      email: 'ops@acme.com'
    }).pipe(
      delay(300),
      map(mapCustomerDto)
    );
  }

  getCustomerById_Recommended(id: number): Observable<Customer> {
    return this.getCustomers().pipe(
      map(customers => {
        const customer = customers.find(c => c.id === id);

        if (!customer) {
          throw new Error(`Customer ${id} not found`);
        }

        return customer;
      })
    );
  }

  getCustomerById_mockDTO(id: number): Observable<Customer> {
    return of<CustomerDto[]>([
      { id: 1, name: 'Acme Capital', city: 'New York', isActive: true, email: 'ops@acme.com' },
      { id: 2, name: 'Blue River Partners', city: 'Chicago', isActive: false, email: 'desk@blueriver.com' },
      { id: 3, name: 'Northwind Trading', city: 'Boston', isActive: true, email: 'support@northwind.com' }
    ]).pipe(
      delay(300),
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
    // Example real version:
    // return this.http.put<CustomerDto>(`/customers/${id}`, request).pipe(
    //   map(mapCustomerDto)
    // );

    return of({
      id,
      name: request.name,
      city: request.city,
      status: request.status,
      contactEmail: request.contactEmail
    }).pipe(delay(300));
  }
}