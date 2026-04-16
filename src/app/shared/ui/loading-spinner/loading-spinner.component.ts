import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `<p class="loading">Loading...</p>`,
  styles: [`.loading { padding: 12px 0; }`]
})
export class LoadingSpinnerComponent {}