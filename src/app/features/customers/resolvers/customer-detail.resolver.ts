import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CustomersApiService } from '../data-access/customers-api.service';
import { Customer } from '../models/customer.models';

export const customerDetailResolver: ResolveFn<Customer> = async (route) => {
  const api = inject(CustomersApiService);
  const id = Number(route.paramMap.get('id'));

  return firstValueFrom(api.getCustomerById(id));
};