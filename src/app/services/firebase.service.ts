import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, Firestore, doc, setDoc, getDoc } from 'firebase/firestore';

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

  constructor() {
    this.firebaseApp = initializeApp(firebaseConfig);  // Inizializza Firebase
    this.auth = getAuth(this.firebaseApp);  // Ottieni l'istanza dell'autenticazione
    this.storage = getStorage(this.firebaseApp); // Ottieni l'istanza di Firebase Storage
    this.firestore = getFirestore(this.firebaseApp); // Ottieni l'istanza di Firestore
    console.log('Firebase initialized', this.firebaseApp.name, this.auth);
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

  // Metodo per salvare il contenuto della lettera in Firestore
  async saveLetterContent(userId: string, letterContent: string): Promise<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    await setDoc(userDoc, { letterContent }, { merge: true });
  }

  // Metodo per recuperare il contenuto della lettera da Firestore
  async getLetterContent(userId: string): Promise<string | null> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      return docSnap.data()['letterContent'] || null;
    } else {
      return null;
    }
  }
}
