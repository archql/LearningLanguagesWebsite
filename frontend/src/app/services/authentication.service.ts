import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TODO temp
  loggedIn = false

  constructor() { 
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
