import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { FirebaseService } from './firebase.service'; // Importa FirebaseService
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { NameDialogComponent } from '../name-dialog/name-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private netlifyUrl = 'https://tubular-praline-980e23.netlify.app/.netlify/functions/get-users';

  constructor(private router: Router, private firebaseService: FirebaseService, private http: HttpClient, private dialog: MatDialog) {
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
      const userName = await this.firebaseService.getUserName(userCredential.user.uid);
      if (!userName) {
        const dialogRef = this.dialog.open(NameDialogComponent, {
          width: '250px'
        });

        dialogRef.afterClosed().subscribe(async (name) => {
          if (name) {
            await this.firebaseService.saveUserName(userCredential.user.uid, name);
            console.log('Nome salvato:', name);
          }
        });
      }
      console.log('Login riuscito:', userCredential.user, 'Nome:', userName);
      return true;
    } catch (error) {
      console.error('Login fallito:', error);
      return false;
    }
  }

  // Registrazione dell'utente
  async register(email: string, password: string, name: string): Promise<boolean> {
    if (!email || !password || !name) {
      console.error("Email, password or name is missing");
      return false;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(this.firebaseService.auth, email, password);
      this.loggedInUser.next(userCredential.user);
      await this.firebaseService.saveUserName(userCredential.user.uid, name); // Salva il nome dell'utente
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
