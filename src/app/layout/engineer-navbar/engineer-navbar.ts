import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Theme, ThemeMode } from '../../core/services/theme';
import { LucideAngularModule, LayoutDashboard, ClipboardList, Wrench, Calendar, User, Bell, LogOut, Menu, X, Sun, Moon, Monitor, Check } from 'lucide-angular';

interface NavLink {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-engineer-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './engineer-navbar.html',
  styleUrl: './engineer-navbar.css',
})
export class EngineerNavbar {
  readonly icons = {
    dashboard: LayoutDashboard,
    clipboard: ClipboardList,
    wrench: Wrench,
    calendar: Calendar,
    user: User,
    bell: Bell,
    logout: LogOut,
    menu: Menu,
    close: X,
    sun: Sun,
    moon: Moon,
    monitor: Monitor,
    check: Check,
  };

  readonly themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: 'light', label: 'Clair', icon: Sun },
    { mode: 'dark', label: 'Sombre', icon: Moon },
    { mode: 'system', label: 'Système', icon: Monitor },
  ];

  isThemeMenuOpen = false;

  constructor(
    private auth: Auth,
    public theme: Theme,
  ) {}

  get userRole(): string {
    return this.auth.getRole() ?? '';
  }

  get userFullName(): string {
    return this.auth.getCurrentUsername() ?? '';
  }

  navLinks: NavLink[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '/' },
    { label: 'Demandes', icon: 'clipboard', path: '/demandes' },
    { label: 'Interventions', icon: 'wrench', path: '/interventions' },
    { label: 'Calendrier', icon: 'calendar', path: '/calendar' },
    { label: 'Profil', icon: 'user', path: '/profile' },
    { label: 'Notifications', icon: 'bell', path: '/notifications' },
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

  get currentThemeIcon() {
    const found = this.themeOptions.find((o) => o.mode === this.theme.mode());
    return found ? found.icon : Monitor;
  }

  getIcon(iconKey: string) {
    return this.icons[iconKey as keyof typeof this.icons];
  }

  toggleThemeMenu(): void {
    this.isThemeMenuOpen = !this.isThemeMenuOpen;
  }

  closeThemeMenu(): void {
    this.isThemeMenuOpen = false;
  }

  selectTheme(mode: ThemeMode): void {
    this.theme.setMode(mode);
    this.closeThemeMenu();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  onLogoutClick(): void {
    this.auth.logout(); // supprime le token, met à jour isAuthenticated et navigue vers /login
    this.logout.emit(); // notifie le parent au cas où il a besoin de réagir
  }

  onNotificationsClick(): void {
    this.notificationsClick.emit();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 1024 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }
}