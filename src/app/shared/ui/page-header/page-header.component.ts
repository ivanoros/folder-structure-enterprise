import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <header class="header">
      <h1>{{ title() }}</h1>
      @if (subtitle()) {
        <p>{{ subtitle() }}</p>
      }
    </header>
  `,
  styles: [`
    .header { margin-bottom: 20px; }
    h1 { margin: 0 0 8px; font-size: 30px; }
    p { margin: 0; color: #555; }
  `]
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input('');
}