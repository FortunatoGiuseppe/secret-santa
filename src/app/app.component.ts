import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; // Importa RouterLink e RouterOutlet
import { WishlistComponent } from './wishlist/wishlist.component';

@Component({
  selector: 'app-root',
  standalone: true, // Componente standalone
  imports: [RouterLink, RouterOutlet, WishlistComponent], // Aggiungi RouterOutlet per supportare il router
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Secret Santa App';
}
