import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly apiUrl = 'http://localhost:8080/api';
  private http = inject(HttpClient);

  // ... (getEvents, getEventById, getMyOrganizedEvents, etc.) ...

  /**
   * --- THIS IS THE FIX ---
   * This method now accepts the userId and sends it as a JSON object
   * in the body of the POST request, which is what the backend expects.
   * Backend Endpoint: POST /api/events/{eventId}/participants
   * Expected Body: { "userId": 123 }
   */
  registerForEvent(eventId: number, userId: number): Observable<any> {
    const body = { userId: userId };
    return this.http.post(`${this.apiUrl}/events/${eventId}/participants`, body);
  }

  // ... (the rest of the methods in this service) ...

  getEvents(searchTerm?: string, status?: 'upcoming' | 'past'): Observable<Event[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.append('searchTerm', searchTerm);
    if (status) params = params.append('status', status);
    return this.http.get<Event[]>(`${this.apiUrl}/events`, { params });
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/events/${id}`);
  }

  getMyOrganizedEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events/my-events`);
  }

  getUserRegisteredEventIds(userId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/users/${userId}/registrations/ids`);
  }

  downloadCertificate(eventId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.apiUrl}/certificates/event/${eventId}`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  createEvent(eventData: Event): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events`, eventData);
  }

  updateEvent(id: number, eventData: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${id}`, eventData);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${id}`, { responseType: 'text' });
  }
  
  removeParticipant(eventId: number, userId: number): Observable<Event> {
    return this.http.delete<Event>(`${this.apiUrl}/organizer/events/${eventId}/participants/${userId}`);
  }

  emailParticipants(eventId: number, emailData: { subject: string, body: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/organizer/events/${eventId}/email`, emailData, { responseType: 'text' });
  }
}