import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  // CommonModule is for *ngIf, RouterModule is for routerLink
  imports: [CommonModule, RouterModule], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
logout() {
throw new Error('Method not implemented.');
}
  
  // We inject AuthService and make it public so the HTML template
  // can directly use its properties and methods.
  public authService = inject(AuthService);

  // No other logic is needed for this simple landing page.
}