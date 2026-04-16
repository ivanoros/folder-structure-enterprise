import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Customer } from '../../models/customer.models';
import { CustomersApiService } from '../../data-access/customers-api.service';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { ErrorAlertComponent } from '../../../../shared/ui/error-alert/error-alert.component';

@Component({
  selector: 'app-customer-edit-page',
  standalone: true,
  imports: [PageHeaderComponent, ErrorAlertComponent, CustomerFormComponent],
  templateUrl: './customer-edit-page.component.html',
  styleUrl: './customer-edit-page.component.css'
})
export class CustomerEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(CustomersApiService);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly customer = this.route.snapshot.data['customer'] as Customer;

  async save(request: {
    name: string;
    city: string;
    status: 'Active' | 'Inactive';
    contactEmail: string;
  }): Promise<void> {
    this.saving.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.api.updateCustomer(this.customer.id, request));
      await this.router.navigate(['/customers', this.customer.id]);
    } catch (error) {
      console.error(error);
      this.error.set('Failed to save customer.');
    } finally {
      this.saving.set(false);
    }
  }
}