// src/app/draw/draw.component.ts
import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-draw',
  standalone: true,
  imports: [CommonModule], // Aggiungi CommonModule per funzioni comuni
  providers: [FirebaseService], // Aggiungi FirebaseService ai provider
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent {
  result: string | null = null;

  constructor(private firebaseService: FirebaseService) {}

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
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
    }
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
