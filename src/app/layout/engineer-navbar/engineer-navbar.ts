import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth';

interface NavLink {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-engineer-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './engineer-navbar.html',
  styleUrl: './engineer-navbar.css',
})
export class EngineerNavbar {
  // À remplacer par les vraies données (AuthService / UserService).
  // Aucune logique d'auth ici : ce composant est purement présentationnel.
  constructor(private auth: Auth) {}
  get userRole(): string {
    return this.auth.getRole() ?? '';
  }

  get userFullName(): string {
    return this.auth.getCurrentUsername() ?? '';
  }
  navLinks: NavLink[] = [
    { label: 'Dashboard', icon: '📊', path: '/' },
    { label: 'Demandes', icon: '📋', path: '/demandes' },
    { label: 'Interventions', icon: '🛠️', path: '/interventions' },
    { label: 'Calendrier', icon: '📅', path: '/calendar' },
    { label: 'Profil', icon: '👤', path: '/profile' },
    { label: 'Notifications', icon: '🔔', path: '/notifications' },
  ];

  notificationCount = 0;

  isMobileMenuOpen = false;

  @Output() logout = new EventEmitter<void>();
  @Output() notificationsClick = new EventEmitter<void>();

  get userInitials(): string {
    return this.userFullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  onLogoutClick(): void {
    localStorage.removeItem('auth_token');
    this.logout.emit();
  }

  onNotificationsClick(): void {
    this.notificationsClick.emit();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 900 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }
}
