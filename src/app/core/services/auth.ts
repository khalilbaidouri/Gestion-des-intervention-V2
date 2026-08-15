import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TypeRole,
} from '../../features/auth/models/auth.model';

interface CustomJwtPayload extends JwtPayload {
  role?: string;
  roles?: string[];
  username?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'https://gestiondesinterventionsdockeriser.onrender.com/api';
  private tokenKey = 'auth_token';

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  isAuthenticated = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    if (this.isBrowser) {
      this.isAuthenticated.set(this.hasToken());
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/connexion`, credentials).pipe(
      tap((response) => {
        if (this.isBrowser) {
          localStorage.setItem(this.tokenKey, response.bearer);
        }
        this.isAuthenticated.set(true);
      }),
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/inscription`, data);
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (!decoded.exp) {
        return true;
      }

      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getRole(): TypeRole | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);

      if (decoded.role === TypeRole.ADMINISTRATEUR) {
        return TypeRole.ADMINISTRATEUR;
      }

      if (decoded.role === TypeRole.INGENIEUR) {
        return TypeRole.INGENIEUR;
      }

      if (decoded.roles?.includes(TypeRole.ADMINISTRATEUR)) {
        return TypeRole.ADMINISTRATEUR;
      }

      if (decoded.roles?.includes(TypeRole.INGENIEUR)) {
        return TypeRole.INGENIEUR;
      }
      if(decoded.roles?.includes(TypeRole.OPERATEUR)) {
        return TypeRole.OPERATEUR;
      }
      if(decoded.roles?.includes(TypeRole.CHEF_DE_DEPARTEMENT)) {
        return TypeRole.CHEF_DE_DEPARTEMENT;
      }

      return null;
    } catch (error) {
      console.error('Erreur lors du décodage du JWT :', error);
      return null;
    }
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
    }

    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getCurrentUsername(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      return decoded.username ?? decoded.sub ?? null;
    } catch (error) {
      console.error('Erreur lors du décodage du JWT :', error);
      return null;
    }
  }
}
