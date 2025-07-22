import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService, ResetPasswordRequest } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  stage: 'enter_password' | 'success' = 'enter_password';
  token: string | null = null;
  newPassword = '';
  confirmPassword = '';
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    // <<< THIS IS THE CRITICAL FIX >>>
    // If a user is currently logged in, log them out first.
    // This ensures they can access this page without being redirected by loggedInGuard.
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
    }
    // <<< END OF FIX >>>

    // Get the token from the URL (e.g., /reset-password?token=...)
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage = "Jeton de réinitialisation invalide ou manquant.";
    }
  }

  onSubmit(): void {
    if (!this.token) return;

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    
    const request: ResetPasswordRequest = {
      token: this.token,
      newPassword: this.newPassword
    };

    this.authService.resetPassword(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.stage = 'success';
        this.successMessage = response;
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage = err.error || "Le jeton est invalide ou a expiré.";
      }
    });
  }
}