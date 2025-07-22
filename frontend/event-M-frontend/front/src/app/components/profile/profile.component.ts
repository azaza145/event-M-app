import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { SecureNavbarComponent } from '../../shared/secure-navbar/secure-navbar.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SecureNavbarComponent, MatSnackBarModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  user: User | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (user: User) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (err) => {
        this.showNotification('Could not load user profile.', 'error');
        this.isLoading = false;
      }
    });
  }

  private showNotification(message: string, panelClass: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: [panelClass], verticalPosition: 'top' });
  }
}