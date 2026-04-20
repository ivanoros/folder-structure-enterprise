import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { CustomerFormComponent } from './customer-form.component';
import { Customer } from '../../models/customer.models';

describe('CustomerFormComponent', () => {
  let fixture: ComponentFixture<CustomerFormComponent>;
  let component: CustomerFormComponent;

  const mockCustomer: Customer = {
    id: 1,
    name: 'Acme Capital',
    city: 'New York',
    status: 'Active',
    contactEmail: 'ops@acme.com'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('customer', mockCustomer);
    fixture.componentRef.setInput('saving', false);

    fixture.detectChanges();
  });

  it('renders initial customer values', () => {
    expect(component.form.getRawValue()).toEqual({
      name: 'Acme Capital',
      city: 'New York',
      status: 'Active',
      contactEmail: 'ops@acme.com'
    });
  });

  it('marks form invalid when required values are missing', () => {
    component.form.setValue({
      name: '',
      city: '',
      status: 'Active',
      contactEmail: ''
    });

    expect(component.form.invalid).toBe(true);
  });

  it('emits saveClicked when form is valid', () => {
    const emitSpy = vi.spyOn(component.saveClicked, 'emit');

    component.form.setValue({
      name: 'Updated Name',
      city: 'Boston',
      status: 'Inactive',
      contactEmail: 'updated@example.com'
    });

    component.submit();

    expect(emitSpy).toHaveBeenCalledWith({
      name: 'Updated Name',
      city: 'Boston',
      status: 'Inactive',
      contactEmail: 'updated@example.com'
    });
  });

  it('does not emit saveClicked when form is invalid', () => {
    const emitSpy = vi.spyOn(component.saveClicked, 'emit');

    component.form.setValue({
      name: '',
      city: '',
      status: 'Active',
      contactEmail: 'not-an-email'
    });

    component.submit();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});