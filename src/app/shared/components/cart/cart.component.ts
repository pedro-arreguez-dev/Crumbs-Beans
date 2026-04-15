import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  router = inject(Router);
  cartService = inject(CartService);

  cartItems = this.cartService.cartItems;
  
  total = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  updateQuantity(id: string | number, quantity: number) {
    this.cartService.updateQuantity(id, quantity);
  }

  removeItem(id: string | number) {
    this.cartService.removeFromCart(id);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
