import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-approvals',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './admin-approvals.component.html',
  styleUrls: ['./admin-approvals.component.scss']
})
export class AdminApprovalsComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);
  private cd = inject(ChangeDetectorRef);

  public pendingUsers: User[] = [];
  public isLoading = true;
  public displayedColumns: string[] = ['fullName', 'email', 'department', 'actions'];

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers(): void {
    this.isLoading = true;
    this.adminService.getPendingUsers().subscribe({
      next: (users) => {
        this.pendingUsers = users;
        this.isLoading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification('Failed to load pending users.', 'error');
        console.error(err);
      }
    });
  }

  onApprove(userId: number): void {
    this.adminService.approveUser(userId).subscribe({
      next: (message) => {
        this.showNotification(message, 'success');
        this.loadPendingUsers(); // Refresh the list
      },
      error: (err) => {
        this.showNotification('Error approving user.', 'error');
        console.error(err);
      }
    });
  }
  
  onDeny(userId: number): void {
    if (confirm('Are you sure you want to deny and permanently delete this user registration?')) {
      this.adminService.denyUser(userId).subscribe({
        next: (message) => {
          this.showNotification(message, 'success');
          this.loadPendingUsers(); // Refresh the list
        },
        error: (err) => {
          this.showNotification('Error denying user.', 'error');
          console.error(err);
        }
      });
    }
  }

  private showNotification(message: string, panelClass: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [panelClass]
    });
  }
}