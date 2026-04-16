import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `<p class="empty">{{ message() }}</p>`,
  styles: [`.empty { color: #666; text-align: center; padding: 24px; }`]
})
export class EmptyStateComponent {
  message = input.required<string>();
}