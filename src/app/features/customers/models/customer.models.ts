export interface Customer {
  id: number;
  name: string;
  city: string;
  status: 'Active' | 'Inactive';
  contactEmail: string;
}

export interface CustomerDto {
  id: number;
  name: string;
  city: string;
  isActive: boolean;
  email: string;
}

export interface CustomerFilter {
  search: string;
  status: 'All' | 'Active' | 'Inactive';
}

export interface UpdateCustomerRequest {
  name: string;
  city: string;
  status: 'Active' | 'Inactive';
  contactEmail: string;
}