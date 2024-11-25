import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  users = ['Alice', 'Bob', 'Charlie', 'David']; // Qui dovrai caricare gli utenti dal back-end
  secretSantaMap: { [key: string]: string } = {};

  assignSecretSanta() {
    let shuffledUsers = [...this.users];
    shuffledUsers = shuffledUsers.sort(() => Math.random() - 0.5);

    this.users.forEach((user, index) => {
      const santa = shuffledUsers[index === shuffledUsers.length - 1 ? 0 : index + 1];
      this.secretSantaMap[user] = santa;
    });
    console.log(this.secretSantaMap); // Invia a ciascuno tramite email o altro sistema
  }
}
