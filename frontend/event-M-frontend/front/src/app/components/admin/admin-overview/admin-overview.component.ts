import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { EventService } from '../../../services/event.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss']
})
export class AdminOverviewComponent implements OnInit {
  private adminService = inject(AdminService);
  private eventService = inject(EventService);

  public isLoading = true;
  public stats = {
    pendingUsers: 0,
    activeUsers: 0,
    totalEvents: 0
  };

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin({
      pendingUsers: this.adminService.getPendingUsers(),
      activeUsers: this.adminService.getUsers(),
      events: this.eventService.getEvents()
    }).subscribe({
      next: (results) => {
        this.stats.pendingUsers = results.pendingUsers.length;
        this.stats.activeUsers = results.activeUsers.length;
        this.stats.totalEvents = results.events.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // Handle error appropriately
      }
    });
  }
}