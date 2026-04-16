import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header.component';
import { Customer } from '../../models/customer.models';

@Component({
  selector: 'app-customer-detail-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  templateUrl: './customer-detail-page.component.html',
  styleUrl: './customer-detail-page.component.css'
})
export class CustomerDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly customer = this.route.snapshot.data['customer'] as Customer;
}