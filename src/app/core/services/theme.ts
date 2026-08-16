import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class Theme {
  private readonly storageKey = 'theme-mode';

  // true uniquement dans le navigateur, false pendant le rendu SSR (Node)
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly mediaQuery: MediaQueryList | null = this.isBrowser
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  /** Mode choisi par l'utilisateur : 'light' | 'dark' | 'system' */
  mode = signal<ThemeMode>(this.getStoredMode());

  constructor() {
    // Réagit aux changements de préférence OS quand on est en mode "système"
    if (this.isBrowser && this.mediaQuery) {
      this.mediaQuery.addEventListener('change', () => {
        if (this.mode() === 'system') {
          this.applyTheme('system');
        }
      });
    }

    // Applique le thème à chaque changement de mode (uniquement côté navigateur)
    effect(() => {
      this.applyTheme(this.mode());
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, mode);
    }
  }

  private getStoredMode(): ThemeMode {
    if (!this.isBrowser) return 'system';
    const stored = localStorage.getItem(this.storageKey) as ThemeMode | null;
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }

  private applyTheme(mode: ThemeMode): void {
    if (!this.isBrowser) return;
    const isDark = mode === 'dark' || (mode === 'system' && !!this.mediaQuery?.matches);
    document.documentElement.classList.toggle('dark', isDark);
  }
}
