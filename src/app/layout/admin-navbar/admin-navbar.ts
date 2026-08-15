import { Component, output, HostListener, EventEmitter, Output } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  icon: string;
  path: string;
}
@Component({
  selector: 'app-admin-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css',
})
export class AdminNavbar {
  constructor(private auth: Auth) {}
  get userRole(): string {
    return this.auth.getRole() ?? '';
  }

  get userFullName(): string {
    return this.auth.getCurrentUsername() ?? '';
  }
  navLinks: NavLink[] = [
    { label: 'Dashboard', icon: '📊', path: '/' },
    { label: 'Utilisateurs', icon: '👥', path: '/users' },
    { label: 'Demandes', icon: '📋', path: '/demandes' },
    { label: 'Interventions', icon: '🛠️', path: '/interventions' },
    { label: 'Calendrier', icon: '📅', path: '/calendar' },
    { label: 'Profil', icon: '👤', path: '/profile' },
    { label: 'ajouter utilisateur', icon: '➕', path: '/inscreption' },
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
