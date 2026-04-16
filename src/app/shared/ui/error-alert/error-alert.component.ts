import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  template: `
    <div class="error">
      {{ message() }}
    </div>
  `,
  styles: [`
    .error {
      margin-bottom: 16px;
      padding: 12px 14px;
      border: 1px solid #d9534f;
      border-radius: 8px;
      background: #fdf0f0;
      color: #a94442;
    }
  `]
})
export class ErrorAlertComponent {
  message = input.required<string>();
}