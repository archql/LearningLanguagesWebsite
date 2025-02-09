import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface UserCredentials {email: string, password: string};

@Injectable({
  providedIn: 'root'
})
export class AuthServiceMock {

  // TODO temp
  loggedIn = false

  constructor(private http: HttpClient) { 
    this.loggedIn = false; 
  }

  isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
  }

  login(email: string, password: string) {
    if (email == 'aa@aa' && password.startsWith('1')) {
      // logged in
      localStorage.setItem('loggedIn', 'true');
      return true;
    } else {
      return false;
    }
  }
}
