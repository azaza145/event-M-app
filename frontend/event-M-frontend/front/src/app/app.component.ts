import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: '<router-outlet></router-outlet>', // The template is now extremely simple
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front';
}