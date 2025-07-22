import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service'; // <-- Correctly import UserService
import { Event } from '../../models/event.model';
import { User, UserRole } from '../../models/user.model';
import { SecureNavbarComponent } from '../../shared/secure-navbar/secure-navbar.component';
import { EventFormComponent } from '../admin/event-form/event-form.component';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [
    CommonModule, 
    DatePipe, 
    MatCardModule, 
    MatTableModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTooltipModule, 
    MatDialogModule, 
    MatSnackBarModule, 
    SecureNavbarComponent
  ],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {
  private eventService = inject(EventService);
  private userService = inject(UserService); // <-- Correctly inject UserService
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cd = inject(ChangeDetectorRef);

  public myEvents: Event[] = [];
  private allUsers: User[] = [];
  public isLoading = true;
  public displayedColumns: string[] = ['title', 'date', 'location', 'participants', 'actions'];

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    // Call the general, non-admin service method to get all users
    this.userService.getAllInvitableUsers().subscribe({
        next: (users: User[]) => {
            this.allUsers = users; // No need to filter here if the backend already does it
            this.loadMyEvents();
        },
        error: (err: any) => {
            this.isLoading = false;
            this.showNotification('Failed to load user list for event creation.', 'error');
            console.error("Error fetching invitable users:", err);
        }
    });
  }

  loadMyEvents(): void {
    this.eventService.getMyOrganizedEvents().subscribe({
      next: (events) => {
        this.myEvents = events;
        this.isLoading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification('Failed to load your organized events.', 'error');
        console.error("Error fetching my-events:", err);
      }
    });
  }

  openEventDialog(event?: Event): void {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '600px',
      disableClose: true,
      // --- THIS IS THE FIX ---
      // Pass the pre-loaded user list directly to the dialog's data.
      data: { 
        event: event ? { ...event } : null, 
        allUsers: this.allUsers 
      }
    });

    dialogRef.afterClosed().subscribe(formData => {
      if (formData) {
        this.isLoading = true;
        const isUpdating = !!event?.id;
        
        // Map the selected participant IDs back to full User objects
        const selectedParticipants = this.allUsers.filter(user => 
          formData.participantIds?.includes(user.id)
        );

        const payload: Partial<Event> = {
          ...formData,
          participants: selectedParticipants,
          id: event?.id
        };
        delete payload.participants;

        const saveObservable = isUpdating
          ? this.eventService.updateEvent(payload.id!, payload as Event)
          : this.eventService.createEvent(payload as Event);
        
        saveObservable.subscribe({
          next: () => {
            this.showNotification(`Event ${isUpdating ? 'updated' : 'created'} successfully!`, 'success');
            this.loadMyEvents();
          },
          error: (err) => {
            this.showNotification(err.error?.message || 'Failed to save the event.', 'error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  deleteEvent(event: Event): void {
    if (!event.id) return;
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${event.title}"?`)) {
      this.eventService.deleteEvent(event.id).subscribe({
        next: () => {
          this.showNotification('Événement supprimé avec succès !', 'success');
          this.loadMyEvents();
        },
        error: (err) => {
          this.showNotification(err.error || "Erreur lors de la suppression de l'événement.", 'error');
        }
      });
    }
  }

  private showNotification(message: string, panelClass: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', { 
        duration: 4000, 
        panelClass: [panelClass],
        verticalPosition: 'top' 
    });
  }
}