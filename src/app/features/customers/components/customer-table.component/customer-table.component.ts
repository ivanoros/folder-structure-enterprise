import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Customer } from '../models/customer.models';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [RouterLink, EmptyStateComponent],
  template: `
    @if (customers().length === 0) {
      <app-empty-state message="No customers found." />
    } @else {
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Status</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (customer of customers(); track customer.id) {
            <tr>
              <td>{{ customer.name }}</td>
              <td>{{ customer.city }}</td>
              <td>{{ customer.status }}</td>
              <td>{{ customer.contactEmail }}</td>
              <td>
                <a [routerLink]="['/customers', customer.id]">Details</a>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <button type="button" (click)="refreshClicked.emit()">Refresh</button>
    }
  `,
  styles: [`
    .table { width:100%; border-collapse:collapse; margin-bottom:16px; background:#fff; }
    th, td { border:1px solid #e5e7eb; padding:12px; text-align:left; }
    th { background:#f3f4f6; }
    button { padding:10px 14px; border-radius:8px; border:1px solid #bbb; background:#fff; }
  `]
})
export class CustomerTableComponent {
  customers = input.required<Customer[]>();
  refreshClicked = output<void>();
}