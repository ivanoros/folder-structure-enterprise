import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Customer } from '../../models/customer.models';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css'
})
export class CustomerFormComponent {
  private readonly fb = inject(FormBuilder);

  customer = input.required<Customer>();
  saving = input(false);

  saveClicked = output<{
    name: string;
    city: string;
    status: 'Active' | 'Inactive';
    contactEmail: string;
  }>();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    status: ['Active' as 'Active' | 'Inactive', [Validators.required]],
    contactEmail: ['', [Validators.required, Validators.email]]
  });

  constructor() {
    effect(() => {
      const customer = this.customer();

      this.form.reset({
        name: customer.name,
        city: customer.city,
        status: customer.status,
        contactEmail: customer.contactEmail
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saveClicked.emit(this.form.getRawValue());
  }
}