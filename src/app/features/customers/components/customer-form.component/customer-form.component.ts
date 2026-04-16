import { Component, effect, input, output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer } from '../models/customer.models';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="grid">
        <label>
          Name
          <input formControlName="name" />
        </label>

        <label>
          City
          <input formControlName="city" />
        </label>

        <label>
          Status
          <select formControlName="status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        <label>
          Contact Email
          <input formControlName="contactEmail" />
        </label>
      </div>

      <div class="actions">
        <button type="submit" [disabled]="form.invalid || saving()">Save</button>
      </div>
    </form>
  `,
  styles: [`
    .grid { display:grid; grid-template-columns:repeat(2, minmax(240px, 1fr)); gap:16px; background:#fff; padding:16px; border:1px solid #ddd; border-radius:10px; }
    label { display:flex; flex-direction:column; gap:6px; }
    input, select { padding:10px; border:1px solid #bbb; border-radius:8px; }
    .actions { margin-top:16px; }
    button { padding:10px 14px; border-radius:8px; }
  `]
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
    if (this.form.invalid) return;
    this.saveClicked.emit(this.form.getRawValue());
  }
}