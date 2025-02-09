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

  isLoggedIn(): boolean {
    let token;
    if (typeof window !== 'undefined') { 
      token = localStorage.getItem('token');
    }
    //return !!token;
    return true; // TODO only for testing
    // return !!token && !this.jwtHelper.isTokenExpired(token);
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
        return of({ message: error, result: false });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/main']); 
  }
}
