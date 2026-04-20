import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, firstValueFrom } from 'rxjs';

import { CustomersApiService } from './customers-api.service';
import { HttpClient } from '@angular/common/http';

describe('CustomersApiService', () => {
  let service: CustomersApiService;
  let httpMock: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    httpMock = {
      get: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CustomersApiService,
        { provide: HttpClient, useValue: httpMock }
      ]
    });

    service = TestBed.inject(CustomersApiService);
  });

  it('maps customer DTOs to customers', async () => {
    httpMock.get.mockReturnValue(
      of([
        {
          id: 1,
          name: 'Acme Capital',
          city: 'New York',
          isActive: true,
          email: 'ops@acme.com'
        }
      ])
    );

    const result = await firstValueFrom(service.getCustomers());

    expect(result).toEqual([
      {
        id: 1,
        name: 'Acme Capital',
        city: 'New York',
        status: 'Active',
        contactEmail: 'ops@acme.com'
      }
    ]);
  });
});