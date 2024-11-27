// src/app/dashboard/dashboard.component.ts
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Component, OnInit } from '@angular/core';
import { WishlistComponent } from "../wishlist/wishlist.component";
import { AuthService } from '../services/auth.service'; // Importa AuthService

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [WishlistComponent, CommonModule]
})
export class DashboardComponent implements OnInit {
  loggedInUser: string | null = null;

  constructor(private authService: AuthService) {}

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
