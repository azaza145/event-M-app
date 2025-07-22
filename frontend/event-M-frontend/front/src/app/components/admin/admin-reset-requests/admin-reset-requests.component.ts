import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, User } from '../../services/admin.service';

@Component({
  selector: 'app-admin-reset-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-reset-requests.component.html',
  styleUrls: ['./admin-reset-requests.component.scss']
})
export class AdminResetRequestsComponent implements OnInit {

  private adminService = inject(AdminService);

  public requests: User[] = [];
  public isLoading = true;
  public message = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.adminService.getPendingResetRequests().subscribe(data => {
      this.requests = data;
      this.isLoading = false;
    });
  }

  onApprove(userId: number): void {
    if (confirm('Are you sure you want to approve this password reset request?')) {
      this.adminService.approvePasswordReset(userId).subscribe({
        next: (response) => {
          this.message = response;
          this.loadRequests(); // Refresh the list to remove the approved request
        },
        error: (err) => {
          this.message = 'Error approving request.';
          console.error(err);
        }
      });
    }
  }
}