import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface AuthResponse { token: string };
export interface RegisterResponse { message?: string, result: boolean };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authUrl = '/api/auth/';

  constructor(
    private http: HttpClient, 
    private router: Router,
  ) { }

  killToken() {
    if (typeof window !== 'undefined') { 
      localStorage.removeItem('token');
    }
  }

  isTokenExpired(token : string): boolean {
    try {
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      return Date.now() >= expiry * 1000;
    } catch (e) {
      return false;
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') { 
      return localStorage.getItem('token');
    } else  {
      return null;
    }
  }

  isLoggedIn(): boolean {
    let token = this.getToken();
    return true; // !!token && !this.isTokenExpired(token);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token!);
      }), 
      catchError(error => {
        console.log(error);
        return of({ token: '' });
      })
    );
  }

  register(email: string, password: string, nickname: string, language: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.authUrl}register`, { email, password, nickname, language }).pipe(
      tap(response => {
        return of({ result: true });
      }), 
      catchError(error => {
        console.log(error);
        return of({ message: error.message, result: false });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/main']); 
  }
}
