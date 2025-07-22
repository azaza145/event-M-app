import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
// <<< FIX: Import the new request interface
import { AuthService, LoginRequest, AdminForcedResetRequest } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginData: LoginRequest = { email: '', password: '' };
  public isSubmitting = false;
  public errorMessage = '';
  public resetRequired = false;
  public newPasswordData = { password: '', confirmPassword: '' };

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.resetRequired = false;

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response.role === UserRole.ADMIN) {
          this.router.navigate(['/admin/dashboard']); 
        } else {
          this.router.navigate(['/dashboard']); 
        }
      },
      error: (err: HttpErrorResponse) => { // Use HttpErrorResponse type
        this.isSubmitting = false;
        // The backend should return a 403 status for this specific case
        if (err.status === 403 && err.error?.message.includes('password reset')) {
          this.errorMessage = err.error.message || 'Réinitialisation du mot de passe requise par un administrateur.';
          this.resetRequired = true;
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect. Veuillez réessayer.';
        }
        console.error('Login error:', err);
      }
    });
  }

  onResetPasswordSubmit(): void {
    if (this.newPasswordData.password !== this.newPasswordData.confirmPassword) {
      this.errorMessage = 'Les nouveaux mots de passe ne correspondent pas.';
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = '';

    // <<< FIX: Create the correct request object
    const request: AdminForcedResetRequest = {
      email: this.loginData.email,
      newPassword: this.newPasswordData.password
    };

    // <<< FIX: Call the new, correct service method
    this.authService.adminForceResetPassword(request).subscribe({
        next: (message: any) => {
          alert(message);
          this.isSubmitting = false;
          this.resetRequired = false;
          this.loginData.password = '';
          this.newPasswordData = { password: '', confirmPassword: '' };
        },
        error: (err: { error: string; }) => {
          this.errorMessage = err.error || 'Une erreur est survenue lors de la réinitialisation.';
          this.isSubmitting = false;
        }
    });
  }
}