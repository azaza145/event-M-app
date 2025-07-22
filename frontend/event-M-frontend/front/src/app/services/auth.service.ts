import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, UserRole, UserStatus } from '../models/user.model';

// Interfaces for API Communication
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { firstName: string; lastName: string; department: string; email: string; password: string; }
export interface JwtResponse { token: string; id: number; email: string; role: UserRole; firstName: string; lastName: string; department: string; }
export interface ResetPasswordRequest { token: string; newPassword: string; }
export interface AdminForcedResetRequest { email: string; newPassword: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_BASE_URL = 'http://localhost:8080/api';
  private http = inject(HttpClient);
  private router = inject(Router);
  public currentUser = signal<User | null>(null);
  currentUser$: any;

  constructor() { this.loadUserFromStorage(); }

  public isAuthenticated(): boolean { return !!this.currentUser(); }
  public isAdmin(): boolean { return this.currentUser()?.role === UserRole.ADMIN; }

  /**
   * Correctly retrieves the token from localStorage.
   */
  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.API_BASE_URL}/auth/signin`, credentials).pipe(
      tap(response => this.storeAuthData(response))
    );
  }

  public logout(): void {
    localStorage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Correctly stores the received token in localStorage.
   */
  private storeAuthData(response: JwtResponse): void {
      const userToStore: User = {
        id: response.id,
        email: response.email,
        role: response.role,
        firstName: response.firstName,
        lastName: response.lastName,
        department: response.department,
        status: UserStatus.ACTIVE
      };
      // Ensure the key name 'authToken' matches what getToken() is looking for.
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      this.currentUser.set(userToStore);
  }
  
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUser.set(JSON.parse(userJson));
    }
  }

  // Other methods (register, password reset, etc.)
  public register(data: RegisterRequest): Observable<string> {
    return this.http.post(`${this.API_BASE_URL}/auth/signup`, data, { responseType: 'text' });
  }

  public forgotPassword(email: string): Observable<string> {
    return this.http.post(`${this.API_BASE_URL}/password/forgot-password`, { email }, { responseType: 'text' });
  }

  public resetPassword(data: ResetPasswordRequest): Observable<string> {
    return this.http.post(`${this.API_BASE_URL}/password/reset-password`, data, { responseType: 'text' });
  }
  
  public adminForceResetPassword(data: AdminForcedResetRequest): Observable<string> {
    return this.http.post(`${this.API_BASE_URL}/password/force-reset`, data, { responseType: 'text' });
  }
}

export { UserRole };
