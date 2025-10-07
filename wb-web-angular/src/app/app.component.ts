import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="nav">
      <a routerLink="/deals" routerLinkActive="active">Deals</a>
      <a routerLink="/ingest" routerLinkActive="active">Bulk Ingest</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
