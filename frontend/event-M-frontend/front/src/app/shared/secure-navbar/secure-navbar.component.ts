import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-secure-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './secure-navbar.component.html',
  styleUrls: ['./secure-navbar.component.scss']
})
export class SecureNavbarComponent {
  public authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}