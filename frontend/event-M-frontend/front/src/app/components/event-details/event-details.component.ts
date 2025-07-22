import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Event } from '../../models/event.model';
import { User } from '../../models/user.model';
import { SecureNavbarComponent } from '../../shared/secure-navbar/secure-navbar.component';
import { EmailParticipantsComponent } from '../email-participants/email-participants.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, SecureNavbarComponent, MatSnackBarModule, MatDialogModule, MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  event: Event | null = null;
  currentUser: User | null = null;
  isLoading = true;
  isRegistered = false;
  isOrganizerView = false; // Controls if management tools are shown

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    const eventIdParam = this.route.snapshot.paramMap.get('id');
    if (eventIdParam) this.loadEventDetails(Number(eventIdParam));
  }

  loadEventDetails(eventId: number): void {
    this.isLoading = true;
    this.eventService.getEventById(eventId).subscribe({
      next: (eventData) => {
        this.event = eventData;
        this.checkRegistrationStatus();
        this.isOrganizerView = this.currentUser?.id === this.event?.organizer?.id || this.authService.isAdmin();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showNotification("Impossible de charger les détails de l'événement.", 'error');
      }
    });
  }

  checkRegistrationStatus(): void {
    if (!this.currentUser || !this.event?.participants) { this.isRegistered = false; return; }
    this.isRegistered = this.event.participants.some(p => p.id === this.currentUser!.id);
  }

  registerForEvent(): void {
    if (!this.event?.id || !this.currentUser?.id) return;
    this.eventService.registerForEvent(this.event.id, this.currentUser.id).subscribe({
      next: () => {
        this.showNotification(`Inscription réussie !`, 'success');
        this.loadEventDetails(this.event!.id!);
      },
      error: (err) => this.showNotification(err.error?.message || 'Erreur lors de l\'inscription.', 'error')
    });
  }

  removeParticipant(participant: User): void {
    if (!this.event?.id) return;
    if (confirm(`Êtes-vous sûr de vouloir retirer ${participant.firstName} ${participant.lastName} de cet événement ?`)) {
      this.eventService.removeParticipant(this.event.id, participant.id).subscribe({
        next: () => {
          this.showNotification('Participant retiré avec succès.', 'success');
          this.loadEventDetails(this.event!.id!);
        },
        error: () => this.showNotification('Erreur lors du retrait du participant.', 'error')
      });
    }
  }

  openEmailDialog(): void {
    if (!this.event) return;
    const dialogRef = this.dialog.open(EmailParticipantsComponent, {
      width: '600px',
      data: { eventTitle: this.event.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.event?.id) {
        this.eventService.emailParticipants(this.event.id, result).subscribe({
          next: (message) => this.showNotification(message, 'success'),
          error: (err) => this.showNotification(err.error || "Erreur lors de l'envoi de l'email.", 'error')
        });
      }
    });
  }

  private showNotification(message: string, panelClass: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', { duration: 3000, panelClass: [panelClass], verticalPosition: 'top' });
  }
}