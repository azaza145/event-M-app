import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  
  private authService = inject(AuthService);
  private router = inject(Router);

  // <<< FIX: Removed securityQuestion and securityAnswer from this object
  public registerData: RegisterRequest = {
    firstName: '',
    lastName: '',
    department: '',
    email: '',
    password: ''
  };
  public confirmPassword = '';
  public acceptTerms = false;
  public isSubmitting = false;
  public registrationSuccess = false;
  public errorMessage = '';
  public successMessage = '';

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.isSubmitting = true;
    this.registrationSuccess = false;

    this.authService.register(this.registerData).subscribe({
      next: (responseMessage) => {
        this.isSubmitting = false;
        this.registrationSuccess = true;
        this.successMessage = responseMessage;
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000); 
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (typeof err.error === 'string') {
          this.errorMessage = err.error; 
        } else {
          this.errorMessage = 'Une erreur inconnue est survenue. Veuillez réessayer plus tard.';
        }
        console.error('Registration error:', err);
      }
    });
  }
}