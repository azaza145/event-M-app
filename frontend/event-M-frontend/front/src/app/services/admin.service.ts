import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { Question } from '../models/question.model';

// DTO to match the backend for updating user details
interface UpdateDetailsRequest {
  firstName: string;
  lastName: string;
  department: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getPendingUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/pending`);
  }

  approveUser(userId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/users/${userId}/approve`, {}, { responseType: 'text' });
  }

  denyUser(userId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/users/${userId}/deny`, {}, { responseType: 'text' });
  }

  createUser(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }

  updateUserRole(userId: number, role: UserRole): Observable<string> {
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, { role: role.toString() }, { responseType: 'text' });
  }

  deleteUser(userId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { responseType: 'text' });
  }
  
  // --- THIS IS THE FIX ---
  // This method was missing, causing the TypeError. It sends the PUT request to
  // the backend's /api/admin/users/{userId} endpoint to update user details.
  updateUserById(userId: number, details: UpdateDetailsRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, details);
  }
    getUnansweredQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions/unanswered`);
  }

  answerQuestion(id: number, answerText: string): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions/${id}/answer`, { answerText });
  }

  // --- END OF FIX ---
}