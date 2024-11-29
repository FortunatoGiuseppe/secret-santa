// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';  // Aggiungi i servizi necessari
import { FirebaseService } from './services/firebase.service';  // Aggiungi i servizi necessari
import { HttpClientModuleStandalone } from './http-client.module'; // Importa il modulo standalone

export const appConfig: ApplicationConfig = {
  providers: [
    // Fornisce il router per la navigazione
    provideRouter(routes),

    // Aggiungi i tuoi servizi
    AuthService,
    FirebaseService,

    // Importa il modulo standalone per HttpClientModule
    importProvidersFrom(HttpClientModuleStandalone)
  ]
};
