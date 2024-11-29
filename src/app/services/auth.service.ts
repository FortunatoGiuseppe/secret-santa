// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { FirebaseService } from './firebase.service'; // Importa FirebaseService
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private netlifyUrl = 'https://tubular-praline-980e23.netlify.app/.netlify/functions/get-users';

  constructor(private router: Router, private firebaseService: FirebaseService, private http: HttpClient) {
    // Osserva i cambiamenti nello stato di autenticazione
    this.observeAuthState();
  }

  // Recupera la lista degli utenti
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.netlifyUrl);
  }

  // Login dell'utente
  async login(email: string, password: string): Promise<boolean> {
    if (!email || !password) {
      console.error("Email or password is missing");
      return false;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(this.firebaseService.auth, email, password);
      this.loggedInUser.next(userCredential.user);
      console.log('Login riuscito:', userCredential.user);
      return true;
    } catch (error) {
      console.error('Login fallito:', error);
      return false;
    }
  }

  // Registrazione dell'utente
  async register(email: string, password: string): Promise<boolean> {
    if (!email || !password) {
      console.error("Email or password is missing");
      return false;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(this.firebaseService.auth, email, password);
      this.loggedInUser.next(userCredential.user);
      console.log('Registrazione riuscita:', userCredential.user);
      return true;
    } catch (error) {
      console.error('Registrazione fallita:', error);
      return false;
    }
  }

  // Logout dell'utente
  async logout(): Promise<void> {
    try {
      await signOut(this.firebaseService.auth);
      this.loggedInUser.next(null);
      console.log('Logout riuscito');
      this.router.navigate(['/']); // Naviga alla home page
    } catch (error) {
      console.error('Logout fallito:', error);
    }
  }

  // Restituisce l'utente loggato
  getLoggedInUser(): Observable<User | null> {
    return this.loggedInUser.asObservable();
  }

  // Osserva lo stato di autenticazione
  private observeAuthState() {
    onAuthStateChanged(this.firebaseService.auth, (user) => {
      this.loggedInUser.next(user);
    });
  }
}
