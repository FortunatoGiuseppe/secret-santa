// src/app/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, Firestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const firebaseConfig = {
  apiKey: "AIzaSyAUDBK7pFdmxQJrbPmHtMSBvxXv6Y2eLag",
  authDomain: "secret-santa-8a003.firebaseapp.com",
  projectId: "secret-santa-8a003",
  storageBucket: "secret-santa-8a003.appspot.com",
  messagingSenderId: "202103216018",
  appId: "1:202103216018:web:695b0df39f8105bd12d34b",
  measurementId: "G-7P5WLQHHPX"
};

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firebaseApp: FirebaseApp;
  auth: Auth;
  storage: any;
  firestore: Firestore;
  private netlifyUrl = '/.netlify/functions/get-users'; // URL della funzione Netlify

  constructor(private http: HttpClient) {
    this.firebaseApp = initializeApp(firebaseConfig); // Inizializza Firebase
    this.auth = getAuth(this.firebaseApp); // Ottieni l'istanza dell'autenticazione
    this.storage = getStorage(this.firebaseApp); // Ottieni l'istanza di Firebase Storage
    this.firestore = getFirestore(this.firebaseApp); // Ottieni l'istanza di Firestore
    console.log('Firebase initialized', this.firebaseApp.name, this.auth);
  }

  // Metodo per ottenere gli utenti autenticati tramite la funzione Netlify
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.netlifyUrl);
  }

  // Metodo per ottenere un utente per ID
  async getUserById(userId: string): Promise<any | null> {
    const users = await this.getUsers().toPromise();
    return users ? users.find(user => user.uid === userId) : null;
  }

  // Metodo per caricare le immagini su Firebase Storage
  async uploadImage(file: File): Promise<string> {
    const storageRef = ref(this.storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  }

  // Metodo per salvare l'URL dell'immagine in Firestore
  async saveImageUrl(userId: string, imageUrl: string): Promise<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    await setDoc(userDoc, { imageUrl }, { merge: true });
  }

  // Metodo per recuperare l'URL dell'immagine da Firestore
  async getImageUrl(userId: string): Promise<string | null> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      return docSnap.data()['imageUrl'] || null;
    } else {
      return null;
    }
  }

  // Metodo per recuperare il contenuto della lettera da Firestore
  async getLetterContent(userId: string): Promise<string | null> {
    const userDoc = doc(this.firestore, `letter/${userId}`);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      return docSnap.data()['letterContent'] || null;
    } else {
      return null;
    }
  }

  // Metodo per salvare il contenuto della lettera in Firestore
  async saveLetterContent(userId: string, letterContent: string): Promise<void> {
    const userDoc = doc(this.firestore, `letter/${userId}`);
    await setDoc(userDoc, { letterContent }, { merge: true });
  }

  // Nuovo: Salva gli abbinamenti Secret Santa in Firestore
  async saveAssignments(assignments: Record<string, string>): Promise<void> {
    const batchPromises = Object.entries(assignments).map(([giver, receiver]) => {
      const assignmentDoc = doc(this.firestore, `assignments/${giver}`);
      return setDoc(assignmentDoc, { receiver });
    });
    await Promise.all(batchPromises);
  }

  // Nuovo: Recupera l'abbinamento di un utente specifico
  async getAssignment(userId: string): Promise<{ receiver: string } | null> {
    const assignmentDoc = doc(this.firestore, `assignments/${userId}`);
    const docSnap = await getDoc(assignmentDoc);
    if (docSnap.exists()) {
      return docSnap.data() as { receiver: string };
    }
    return null;
  }
}
