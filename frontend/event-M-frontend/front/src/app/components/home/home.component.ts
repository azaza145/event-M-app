import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // We inject the AuthService and make it public to use it in the template
  public authService = inject(AuthService);

  // This method will be called by the (click) event on the logout link
  logout(): void {
    this.authService.logout();
  }
}