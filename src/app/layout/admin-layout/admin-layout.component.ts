import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AdminNavbar } from '../admin-navbar/admin-navbar';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  imports: [RouterOutlet, AdminNavbar]
})
export class AdminLayout {
  private router = inject(Router);

  onLogout(): void {
    this.router.navigate(['/login']);
  }
}