import { Component } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../../../core/services/auth';

import { LoginRequest, TypeRole } from '../../models/auth.model';

import { LucideAngularModule, Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink , LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;

  errorMessage = '';

  isLoading = false;
  currentYear = new Date().getFullYear();

   readonly icons = {
    mail: Mail,
    lock: Lock,
    eye: Eye,
    eyeOff: EyeOff,
    shieldCheck: ShieldCheck,
    alertCircle: AlertCircle,
    arrowRight: ArrowRight,
  };

    showPassword = false;

    togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    this.errorMessage = '';

    const credentials = this.loginForm.value as LoginRequest;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;

        const role = this.authService.getRole();

        console.log('Role connecté :', role);

        if (role === TypeRole.ADMINISTRATEUR) {
          this.router.navigate(['/admin/dashboard']);

          return;
        }

        if (role === TypeRole.INGENIEUR) {
          this.router.navigate(['/engineer/dashboard']);

          return;
        }

        this.errorMessage = 'Rôle utilisateur inconnu.';
      },

      error: (error) => {
        console.error('Erreur login :', error);

        this.isLoading = false;

        this.errorMessage = 'Email ou mot de passe incorrect.';
      },
    });
  }
}
