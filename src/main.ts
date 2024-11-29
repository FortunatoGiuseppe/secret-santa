import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';  // Importa la configurazione

// Bootstrap dell'app con la configurazione personalizzata
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
