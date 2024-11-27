// src/app/wishlist/wishlist.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class WishlistComponent implements OnInit {
  private cloudName = 'dyphfsvio';
  private uploadPreset = 'unsigned_preset';
  private folderName = 'wishlist_images'; // Nome della cartella su Cloudinary
  uploadedImageUrl: string | null = null;
  userId: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadImageUrl();
      }
    });
  }

  async loadImageUrl(): Promise<void> {
    if (this.userId) {
      this.uploadedImageUrl = await this.firebaseService.getImageUrl(this.userId);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadImage(file).then(url => {
        this.uploadedImageUrl = url;
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

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', this.folderName); // Specifica la cartella di destinazione

    const response = await this.http.post<any>(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, formData).toPromise();
    return response.secure_url;
  }

  async deleteImage(): Promise<void> {
    if (this.uploadedImageUrl && this.userId) {
      const publicId = this.getPublicIdFromUrl(this.uploadedImageUrl);
      await this.http.post('https://YOUR_VERCEL_PROJECT_URL/api/delete-image', { publicId }).toPromise();

      this.uploadedImageUrl = null;
      await this.firebaseService.saveImageUrl(this.userId, '');
      console.log('Image deleted successfully');
    }
  }

  private getPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const publicId = lastPart.split('.')[0];
    return publicId;
  }
}
