import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { Customer } from '../models/customer.models';

@Component({
  selector: 'app-customer-detail-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  template: `
    <app-page-header
      [title]="customer.name"
      subtitle="Customer detail page"
    />

    <div class="card">
      <p><strong>City:</strong> {{ customer.city }}</p>
      <p><strong>Status:</strong> {{ customer.status }}</p>
      <p><strong>Email:</strong> {{ customer.contactEmail }}</p>
    </div>

    <div class="actions">
      <a [routerLink]="['/customers', customer.id, 'edit']">Edit</a>
      <a routerLink="/customers">Back to list</a>
    </div>
  `,
  styles: [`
    .card { background:#fff; padding:16px; border:1px solid #ddd; border-radius:10px; }
    .actions { display:flex; gap:16px; margin-top:16px; }
  `]
})
export class CustomerDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly customer = this.route.snapshot.data['customer'] as Customer;
}