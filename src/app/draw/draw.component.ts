// src/app/draw/draw.component.ts
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-draw',
  standalone: true,
  imports: [CommonModule], // Aggiungi CommonModule per funzioni comuni
  providers: [FirebaseService], // Aggiungi FirebaseService ai provider
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements OnInit {
  result: string | null = null;
  userId: string | null = null;
  assignments: { giver: string, receiver: string }[] = [];

  constructor(private firebaseService: FirebaseService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadAssignment();
      }
    });
  }

  async loadAssignment(): Promise<void> {
    if (this.userId) {
      const assignment = await this.firebaseService.getAssignment(this.userId);
      if (assignment) {
        this.result = assignment.receiver;
      } else {
        this.result = 'Nessun abbinamento trovato.';
      }
    }
  }

  async drawGift(): Promise<void> {
    const users = await this.firebaseService.getUsers().toPromise(); // Ottieni la lista di utenti
    console.log(users);
    if (!users || users.length < 2) {
      alert('Servono almeno 2 utenti per il sorteggio!');
      return;
    }

    const shuffled = this.shuffleArray(users); // Mescola l'array
    const assignments = this.assignSecretSanta(users, shuffled); // Assegna i nomi

    try {
      await this.firebaseService.saveAssignments(assignments); // Salva nel database
      alert('Sorteggio completato con successo!');
      this.loadAssignment(); // Carica l'assegnazione per l'utente corrente
      this.loadAllAssignments(); // Carica tutte le assegnazioni
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
    }
  }

  async loadAllAssignments(): Promise<void> {
    const users = await this.firebaseService.getUsers().toPromise();
    if (!users) {
      console.error('Nessun utente trovato.');
      return;
    }

    const assignments = [];
    for (const user of users) {
      const assignment = await this.firebaseService.getAssignment(user.uid);
      if (assignment) {
        const receiverUser = users.find(u => u.uid === assignment.receiver);
        if (receiverUser) {
          assignments.push({ giver: user.email, receiver: receiverUser.email });
        }
      }
    }
    this.assignments = assignments;
  }

  shuffleArray(array: any[]): any[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  assignSecretSanta(users: any[], shuffled: any[]): Record<string, string> {
    const assignments: Record<string, string> = {};
    for (let i = 0; i < users.length; i++) {
      assignments[users[i].uid] = shuffled[i].uid;
    }
    return assignments;
  }
}
