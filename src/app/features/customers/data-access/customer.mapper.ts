import { Customer, CustomerDto, UpdateCustomerRequest } from '../models/customer.models';

export function mapCustomerDto(dto: CustomerDto): Customer {
  return {
    id: dto.id,
    name: dto.name,
    city: dto.city,
    status: dto.isActive ? 'Active' : 'Inactive',
    contactEmail: dto.email
  };
}

export function mapCustomerToUpdateRequest(customer: Customer): UpdateCustomerRequest {
  return {
    name: customer.name,
    city: customer.city,
    status: customer.status,
    contactEmail: customer.contactEmail
  };
}