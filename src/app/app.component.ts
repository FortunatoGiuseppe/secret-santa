// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router'; // Importa RouterLink e RouterOutlet
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { AuthService } from './services/auth.service'; // Importa AuthService
import { HttpClientModuleStandalone } from './http-client.module';

@Component({
  selector: 'app-root',
  standalone: true, // Componente standalone
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule, HttpClientModuleStandalone ], // Aggiungi RouterOutlet per supportare il router
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Secret Santa App';
  loggedInUser: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Osserva lo stato di autenticazione e aggiorna loggedInUser
    this.authService.getLoggedInUser().subscribe(user => {
      this.loggedInUser = user ? user.email : null;
    });
  }

  // Funzione di logout
  logout() {
    this.authService.logout();
  }
}
