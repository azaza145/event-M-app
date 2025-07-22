import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-admin-event-management',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './admin-event-management.component.html',
  styleUrls: ['./admin-event-management.component.scss']
})
export class AdminEventManagementComponent implements OnInit {
  private eventService = inject(EventService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cd = inject(ChangeDetectorRef);

  public events: Event[] = [];
  public isLoading = true;
  public displayedColumns: string[] = ['title', 'date', 'location', 'participants', 'actions'];

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification('Failed to load events.', 'error');
        console.error(err);
      }
    });
  }

  openEventDialog(event?: Event): void {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '600px',
      disableClose: true,
      data: { event: event ? { ...event } : null } // Pass a copy of the event data or null
    });

    dialogRef.afterClosed().subscribe(result => {
      // Result will contain the form data from the dialog
      if (result) {
        this.isLoading = true;
        
        // If we are editing, the event object will have an ID
        const isUpdating = !!event?.id;
        
        const saveObservable = isUpdating
          ? this.eventService.updateEvent(event!.id, result)
          : this.eventService.createEvent(result);
        
        saveObservable.subscribe({
          next: () => {
            this.showNotification(`Event ${isUpdating ? 'updated' : 'created'} successfully!`, 'success');
            this.loadEvents(); // Reload the list to show changes
          },
          error: (err) => {
            this.showNotification('Failed to save the event.', 'error');
            this.isLoading = false;
            console.error(err);
          }
        });
      }
    });
  }

  deleteEvent(event: Event): void {
    if (!event.id) return;
    if (confirm(`Are you sure you want to delete the event "${event.title}"?`)) {
      this.eventService.deleteEvent(event.id).subscribe({
        next: () => {
          this.showNotification('Event deleted successfully!', 'success');
          this.loadEvents(); // Reload the list after deletion
        },
        error: (err) => {
          this.showNotification('Failed to delete the event.', 'error');
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