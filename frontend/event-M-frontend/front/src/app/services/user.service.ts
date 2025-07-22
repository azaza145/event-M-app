import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

// DTO interfaces to match the backend
interface UpdateDetailsRequest {
  firstName: string;
  lastName: string;
  department: string;
}

interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private profileApiUrl = 'http://localhost:8080/api/profile';
  private usersApiUrl = 'http://localhost:8080/api/users'; // General user endpoint
  private http = inject(HttpClient);
  getUsers: any;

  // --- PROFILE-SPECIFIC METHODS ---

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.profileApiUrl}/me`);
  }

  updateProfileDetails(details: UpdateDetailsRequest): Observable<User> {
    return this.http.put<User>(`${this.profileApiUrl}/me/details`, details);
  }

  changePassword(passwords: UpdatePasswordRequest): Observable<string> {
    return this.http.post(`${this.profileApiUrl}/me/change-password`, passwords, { responseType: 'text' });
  }

  // --- GENERAL USER METHODS ---

  /**
   * Fetches a list of all users that can be invited to an event.
   * This calls a general endpoint that is accessible by authenticated users (like Organizers).
   */
  getAllInvitableUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersApiUrl);
  }
}