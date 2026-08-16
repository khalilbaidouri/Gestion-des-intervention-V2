import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { EngineerNavbar } from '../engineer-navbar/engineer-navbar';

@Component({
  selector: 'app-engineer-layout',
  templateUrl: './engineer-layout.component.html',
  imports: [RouterOutlet, EngineerNavbar],
})
export class EngineerLayout {

  constructor(private router: Router) {
  }

  onLogout(): void {
    this.router.navigate(['/login']);
  }
}
