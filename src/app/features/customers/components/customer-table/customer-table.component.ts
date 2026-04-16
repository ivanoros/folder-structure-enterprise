import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Customer } from '../../models/customer.models';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [RouterLink, EmptyStateComponent],
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.css'
})
export class CustomerTableComponent {
  customers = input.required<Customer[]>();
  refreshClicked = output<void>();
}