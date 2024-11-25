// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { WishlistComponent } from "../wishlist/wishlist.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [WishlistComponent]
})
export class DashboardComponent implements OnInit {
  loggedInUser: string | undefined;

  ngOnInit(): void {
    // Inizializzare la variabile loggedInUser con un valore di esempio (può venire da un servizio)
    this.loggedInUser = 'Giovanni';  // Sostituisci con la logica di recupero dell'utente autenticato
  }
}
