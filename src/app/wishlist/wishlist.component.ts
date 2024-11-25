import { Component } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {
  items: string[] = [];
  newItem: string = '';

  addItem() {
    if (this.newItem) {
      this.items.push(this.newItem);
      this.newItem = '';
    }
  }
}
