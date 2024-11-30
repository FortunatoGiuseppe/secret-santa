import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NameDialogComponent } from '../name-dialog/name-dialog.component'; // Importa il componente del dialogo

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class WishlistComponent implements OnInit {
  private cloudName = 'dyphfsvio';
  private uploadPreset = 'unsigned_preset';
  private folderName = 'wishlist_images'; // Nome della cartella su Cloudinary

  uploadedImageUrl: string | null = null; // URL dell'immagine caricata
  userId: string | null = null; // ID dell'utente corrente
  letterContent: string | null = null; // Contenuto della lettera
  assignedUserEmail: string | null = null; // Email dell'utente assegnato
  assignedUserLetter: string | null = null; // Lettera dell'utente assegnato
  assignedUserImageUrl: string | null = null; // URL dell'immagine dell'utente assegnato
  assignedUserName: string | null = null; // Nome dell'utente assegnato

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private dialog: MatDialog // Aggiungi il dialogo
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadImageUrl();
        this.loadLetterUrl();
        this.loadAssignedUser();
        this.checkAndPromptForUserName(user.uid); // Controlla e richiedi il nome dell'utente se non presente
      }
    });
  }

  // Carica l'URL dell'immagine associata all'utente
  async loadImageUrl(): Promise<void> {
    if (this.userId) {
      this.uploadedImageUrl = await this.firebaseService.getImageUrl(this.userId);
    }
  }

  async loadLetterUrl(): Promise<void> {
    if (this.userId) {
      this.letterContent = await this.firebaseService.getLetterContent(this.userId);
    }
  }

  saveLetter(): void {
    if (this.userId && this.letterContent !== null) {
      this.firebaseService.saveLetterContent(this.userId, this.letterContent);
    }
  }

  // Gestisce il caricamento di un file
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadImage(file).then(url => {
        this.uploadedImageUrl = url;
        this.letterContent = ''; // Cancella la lettera se viene caricata un'immagine
        if (this.userId) {
          this.firebaseService.saveImageUrl(this.userId, url);
        }
        console.log('Image uploaded successfully:', url);
      }).catch(error => {
        console.error('Error uploading image:', error);
        console.error('Error details:', error.error);
      });
    }
  }

  // Carica l'immagine su Cloudinary
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', this.folderName); // Specifica la cartella di destinazione

    const response = await this.http.post<any>(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, formData).toPromise();
    return response.secure_url;
  }

  // Elimina l'immagine caricata
  async deleteImage(): Promise<void> {
    if (this.uploadedImageUrl && this.userId) {
      const publicId = this.getPublicIdFromUrl(this.uploadedImageUrl);
      await this.http.post('/.netlify/functions/delete-image', { publicId }).toPromise();

      this.uploadedImageUrl = null;
      await this.firebaseService.saveImageUrl(this.userId, '');
      console.log('Image deleted successfully');
    }
  }

  // Estrae il publicId dall'URL di Cloudinary
  private getPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const publicId = lastPart.split('.')[0];
    return publicId;
  }

  async loadAssignedUser(): Promise<void> {
    if (this.userId) {
      const assignment = await this.firebaseService.getAssignment(this.userId);
      if (assignment) {
        const assignedUser = await this.firebaseService.getUserById(assignment.receiver);
        if (assignedUser) {
          this.assignedUserEmail = assignedUser.email;
          this.assignedUserName = assignedUser.name; // Aggiungi il nome dell'utente assegnato
          this.assignedUserLetter = await this.firebaseService.getLetterContent(assignment.receiver);
          this.assignedUserImageUrl = await this.firebaseService.getImageUrl(assignment.receiver);
        }
      } else {
        this.assignedUserEmail = 'Nessun abbinamento trovato.';
      }
    }
  }

  // Controlla e richiedi il nome dell'utente se non presente
  async checkAndPromptForUserName(userId: string): Promise<void> {
    const userName = await this.firebaseService.getUserName(userId);
    if (!userName) {
      const dialogRef = this.dialog.open(NameDialogComponent, {
        width: '250px'
      });

      dialogRef.afterClosed().subscribe(async (name) => {
        if (name) {
          await this.firebaseService.saveUserName(userId, name);
          console.log('Nome salvato:', name);
        }
      });
    }
  }
}
