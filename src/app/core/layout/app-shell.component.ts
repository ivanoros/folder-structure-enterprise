import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <h2>Angular 21 Demo</h2>
        <nav>
          <a routerLink="/customers" routerLinkActive="active">Customers</a>
        </nav>
      </aside>

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .shell { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
    .sidebar { padding: 20px; background: #111827; color: white; }
    .sidebar a { color: #cbd5e1; display: block; margin-top: 12px; text-decoration: none; }
    .sidebar a.active { color: white; font-weight: 700; }
    .content { padding: 24px; background: #f5f6f8; }
  `]
})
export class AppShellComponent {}