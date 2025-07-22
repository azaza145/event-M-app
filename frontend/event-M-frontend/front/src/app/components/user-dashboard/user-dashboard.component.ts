import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { saveAs } from 'file-saver';

import { AuthService, UserRole } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { NotificationService } from '../../services/notification.service';
import { QuestionService } from '../../services/question.service';
import { Event } from '../../models/event.model';
import { User } from '../../models/user.model';
import { Notification } from '../../models/notification.model';
import { Question } from '../../models/question.model';
import { SecureNavbarComponent } from '../../shared/secure-navbar/secure-navbar.component';

type FilterStatus = 'my-registrations' | 'upcoming' | 'all';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, FormsModule, SecureNavbarComponent, MatSnackBarModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private eventService = inject(EventService);
  private notificationService = inject(NotificationService);
  private questionService = inject(QuestionService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  currentUser: User | null = null;
  allEvents: Event[] = [];
  displayEvents: Event[] = [];
  notifications: Notification[] = [];
  faqs: Question[] = [];

  stats = { upcomingEvents: 0, myRegistrations: 0, certificatesEarned: 0 };
  isLoading = true;
  
  searchTerm = '';
  newQuestionText = '';
  isSubmittingQuestion = false;
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  activeFilter: FilterStatus = 'upcoming';

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.loadDashboardData();
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => this.filterAndDisplayEvents());
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    if (!this.currentUser?.id) return;

    forkJoin({
      events: this.eventService.getEvents().pipe(catchError(() => of([] as Event[]))),
      myEventIds: this.eventService.getUserRegisteredEventIds(this.currentUser.id).pipe(catchError(() => of([] as number[]))),
      notifications: this.notificationService.getMyNotifications().pipe(catchError(() => of([] as Notification[]))),
      faqs: this.questionService.getAnsweredQuestions().pipe(catchError(() => of([] as Question[])))
    })
    .pipe(finalize(() => {
        this.isLoading = false;
        this.cd.markForCheck();
    }))
    .subscribe(results => {
      const myEventIdsSet = new Set(results.myEventIds);
      this.allEvents = results.events.map(event => ({ ...event, isRegistered: myEventIdsSet.has(event.id) }));
      this.notifications = results.notifications;
      this.faqs = results.faqs;
      this.calculateStats();
      this.filterAndDisplayEvents();
    });
  }

  calculateStats(): void {
    const now = new Date();
    this.stats.upcomingEvents = this.allEvents.filter(e => new Date(e.date) >= now).length;
    this.stats.myRegistrations = this.allEvents.filter(e => e.isRegistered).length;
    this.stats.certificatesEarned = this.allEvents.filter(e => e.isRegistered && this.isPastEvent(e.date)).length;
  }

  setFilter(filter: FilterStatus): void {
    this.activeFilter = filter;
    this.filterAndDisplayEvents();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm.trim());
  }

  filterAndDisplayEvents(): void {
    let filtered = [...this.allEvents];
    const now = new Date();
    if (this.activeFilter === 'my-registrations') { filtered = filtered.filter(e => e.isRegistered); } 
    else if (this.activeFilter === 'upcoming') { filtered = filtered.filter(e => new Date(e.date) >= now); }
    if (this.searchTerm) {
      const lowercasedTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(e => e.title.toLowerCase().includes(lowercasedTerm));
    }
    this.displayEvents = filtered;
    this.cd.markForCheck();
  }

  submitQuestion(): void {
    if (!this.newQuestionText.trim()) return;
    this.isSubmittingQuestion = true;
    this.questionService.submitQuestion(this.newQuestionText).subscribe({
      next: () => {
        this.showNotification('Votre question a été soumise avec succès !', 'success');
        this.newQuestionText = '';
        this.isSubmittingQuestion = false;
      },
      error: () => {
        this.showNotification('Erreur lors de la soumission de la question.', 'error');
        this.isSubmittingQuestion = false;
      }
    });
  }

  isOrganizer = (): boolean => this.currentUser?.role === UserRole.ORGANIZER || this.currentUser?.role === UserRole.ADMIN;
  isPastEvent = (eventDate: string): boolean => new Date(eventDate) < new Date();

  downloadCertificate(eventId: number): void {
    this.eventService.downloadCertificate(eventId).subscribe({
      next: (response) => {
        if (response.body) {
          const contentDisposition = response.headers.get('content-disposition');
          let filename = 'certificate.pdf';
          if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
            if (matches?.[1]) filename = matches[1].replace(/['"]/g, '');
          }
          saveAs(response.body, filename);
        } else {
          this.showNotification('Erreur: Le fichier reçu est vide.', 'error');
        }
      },
      error: () => this.showNotification('Impossible de télécharger le certificat.', 'error')
    });
  }

  register(event: Event): void {
    if (!this.currentUser?.id) return;
    this.eventService.registerForEvent(event.id, this.currentUser.id).subscribe(() => {
      this.showNotification(`Inscription réussie à "${event.title}"!`, 'success');
      this.loadDashboardData();
    });
  }

  markNotificationAsRead(notification: Notification, event: MouseEvent): void {
    event.stopPropagation();
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.isRead = true;
        this.cd.markForCheck();
      });
    }
  }

  navigateToLink(notification: Notification): void {
    if (notification.link) this.router.navigate([notification.link]);
    if (!notification.isRead) this.markNotificationAsRead(notification, new MouseEvent('click'));
  }

  private showNotification(message: string, panelClass: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', { duration: 3000, panelClass: [panelClass], verticalPosition: 'top' });
  }
}