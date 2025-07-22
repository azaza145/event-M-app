import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);

  // <<< FIX: Simplified state. We only have one stage now.
  stage: 'enter_email' | 'request_sent' = 'enter_email';
  
  email = '';
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  /**
   * <<< FIX: Simplified submission handler.
   * It calls the service and shows a confirmation message on success.
   */
  onSubmit(): void {
    if (!this.email) return;
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.stage = 'request_sent'; // Move to the confirmation view
        this.successMessage = response; // Display the message from the backend
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'An unexpected error occurred.';
      }
    });
  }
}