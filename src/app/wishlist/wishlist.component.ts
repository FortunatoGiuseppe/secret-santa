import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class WishlistComponent implements OnInit {
  uploadedImageUrl: string | null = null; // URL dell'immagine
  letterContent: string = ''; // Contenuto della lettera
  userId: string | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadImageUrl();
        this.loadLetterContent(); // Carica il contenuto della lettera se già esiste
      }
    });
  }

  // Carica l'URL dell'immagine se presente
  loadImageUrl(): void {
    if (this.userId) {
      this.firebaseService.getImageUrl(this.userId).then(url => {
        this.uploadedImageUrl = url || null;  // Imposta URL immagine o null
      });
    }
  }

  // Carica il contenuto della lettera da Firestore se presente
  loadLetterContent(): void {
    if (this.userId) {
      this.firebaseService.getLetterContent(this.userId).then(content => {
        this.letterContent = content || ''; // Imposta il contenuto della lettera se esiste
      });
    }
  }

  // Funzione per caricare una nuova immagine
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  // Carica l'immagine su Firebase
  async uploadImage(file: File): Promise<void> {
    const url = await this.firebaseService.uploadImage(file);
    this.uploadedImageUrl = url;
    if (this.userId) {
      this.firebaseService.saveImageUrl(this.userId, url);
    }
  }

  // Elimina l'immagine
  deleteImage(): void {
    this.uploadedImageUrl = null;
    if (this.userId) {
      this.firebaseService.saveImageUrl(this.userId, '');
    }
  }

  // Salva automaticamente il contenuto della lettera
  saveLetter(): void {
    if (this.userId) {
      this.firebaseService.saveLetterContent(this.userId, this.letterContent);
    }
  }
}
