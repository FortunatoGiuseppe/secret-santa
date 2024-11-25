import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUser: string | null = null;

  constructor(private router: Router) { }

  login(username: string, password: string): boolean {
    // In un'app reale, dovresti verificare le credenziali con un backend
    if (username && password) {
      this.loggedInUser = username;
      return true;
    }
    return false;
  }

  logout() {
    this.loggedInUser = null;
    this.router.navigate(['/']);
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }
}
