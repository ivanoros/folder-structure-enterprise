import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerFilter } from '../models/customer.models';

@Component({
  selector: 'app-customer-filter',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="panel">
      <div class="field">
        <label>Search</label>
        <input
          [ngModel]="filter().search"
          (ngModelChange)="searchChange.emit($event)"
          placeholder="Name, city, email"
        />
      </div>

      <div class="field">
        <label>Status</label>
        <select
          [ngModel]="filter().status"
          (ngModelChange)="statusChange.emit($event)"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </section>
  `,
  styles: [`
    .panel { display:flex; gap:16px; padding:16px; margin-bottom:20px; background:#fff; border:1px solid #ddd; border-radius:10px; }
    .field { display:flex; flex-direction:column; gap:6px; min-width:220px; }
    input, select { padding:10px; border:1px solid #bbb; border-radius:8px; }
  `]
})
export class CustomerFilterComponent {
  filter = input.required<CustomerFilter>();
  searchChange = output<string>();
  statusChange = output<CustomerFilter['status']>();
}