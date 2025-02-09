import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthResponse, RegisterResponse } from '../authentication.service';

interface UserCredentials { email: string, password: string };

@Injectable({
  providedIn: 'root'
})
export class AuthServiceMock {

  // TODO temp
  loggedIn = false;

  constructor() { 
    this.loggedIn = false; 
  }

  isLoggedIn() {
    return localStorage.getItem('token') === 'fake-token';
  }

  login(email: string, password: string) : Observable<AuthResponse> {
    if (email == 'aa@aa' && password.startsWith('1')) {
      // logged in
      localStorage.setItem('token', 'fake-token');
      return of({ token: 'fake-token' });
    } else {
      return of({ token: '' });
    }
  }

  register(email: string, password: string, login: string, language: string) : Observable<RegisterResponse> {
    if (email && password && login && language) {
      return of({ result: true });
    } else {
      return of({ result: false });
    }
  }
}
