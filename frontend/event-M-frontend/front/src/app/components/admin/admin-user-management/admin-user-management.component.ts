import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // <--- IMPORT THIS
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

import { AdminService } from '../../../services/admin.service';
import { User, UserRole } from '../../../models/user.model';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.scss']
})
export class AdminUserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private cd = inject(ChangeDetectorRef); // <--- INJECT THE SERVICE

  public activeUsers: User[] = [];
  public isLoading = true;
  public displayedColumns: string[] = ['fullName', 'email', 'department', 'role', 'actions'];
  public readonly allRoles: UserRole[] = Object.values(UserRole).filter(role => role !== UserRole.ADMIN);

  ngOnInit(): void {
    this.loadActiveUsers();
  }

  loadActiveUsers(): void {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.activeUsers = users.filter(user => user.role !== UserRole.ADMIN);
        this.isLoading = false;
        
        // --- FIX: Manually trigger change detection after loading data
        this.cd.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification('Failed to load active users.', 'error');
        this.cd.markForCheck(); // Also update view on error
      }
    });
  }

  onRoleChange(event: any, userToUpdate: User): void {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value as UserRole;
    const originalRole = userToUpdate.role;

    if (newRole === originalRole) return;

    if (confirm(`Êtes-vous sûr de vouloir changer le rôle de ${userToUpdate.firstName} ${userToUpdate.lastName} à ${newRole} ?`)) {
      this.adminService.updateUserRole(userToUpdate.id, newRole).subscribe({
        next: (message) => {
          const userInArray = this.activeUsers.find(u => u.id === userToUpdate.id);
          if (userInArray) {
            userInArray.role = newRole;
          }
          // --- FIX: Manually trigger change detection after updating local data
          this.cd.markForCheck();
          this.showNotification(message, 'success');
        },
        error: (err: HttpErrorResponse) => {
          selectElement.value = originalRole;
          this.showNotification(err.error || 'Error: Could not update role.', 'error');
        }
      });
    } else {
      selectElement.value = originalRole;
    }
  }

  // --- REFACTORED TO RELOAD DATA (MOST RELIABLE METHOD) ---

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, { /* ... */ });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.createUser(result).subscribe({
          next: () => {
            this.showNotification('User created successfully!', 'success');
            this.loadActiveUsers(); // <-- RELOAD DATA INSTEAD OF LOCAL UPDATE
          },
          error: (err) => this.showNotification(err.error || 'Failed to create user.', 'error')
        });
      }
    });
  }
  
  openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, { data: { user: { ...user } } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.updateUserById(user.id, result).subscribe({
          next: () => {
            this.showNotification('User updated successfully!', 'success');
            this.loadActiveUsers(); // <-- RELOAD DATA INSTEAD OF LOCAL UPDATE
          },
          error: (err) => this.showNotification('Failed to update user.', 'error')
        });
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: (message) => {
          this.showNotification(message, 'success');
          this.loadActiveUsers(); // <-- RELOAD DATA INSTEAD OF LOCAL UPDATE
        },
        error: (err) => this.showNotification(err.error || 'Failed to delete user.', 'error')
      });
    }
  }

  private showNotification(message: string, panelClass: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', { duration: 4000, panelClass: [panelClass] });
  }
}