import { Component } from '@angular/core';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent {
  participants = [
    { name: 'Maria', gift: 'Un libro di Natale' },
    { name: 'Luca', gift: 'Calze natalizie' },
    { name: 'Giulia', gift: 'Un giocattolo' },
    { name: 'Marco', gift: 'Un set di luci natalizie' }
  ];

  // Risultato dell'estrazione
  result: string = '';

  // Funzione per eseguire il sorteggio
  drawGift() {
    const randomIndex = Math.floor(Math.random() * this.participants.length);
    const winner = this.participants[randomIndex];
    this.result = `${winner.name} riceverà ${winner.gift}! 🎁`;
  }
}
