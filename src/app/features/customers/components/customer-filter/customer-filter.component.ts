import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerFilter } from '../../models/customer.models';

@Component({
  selector: 'app-customer-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer-filter.component.html',
  styleUrl: './customer-filter.component.css'
})
export class CustomerFilterComponent {
  filter = input.required<CustomerFilter>();
  searchChange = output<string>();
  statusChange = output<CustomerFilter['status']>();
}