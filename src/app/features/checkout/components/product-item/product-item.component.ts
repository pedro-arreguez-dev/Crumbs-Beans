import { Component, Input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '@app/core/models/products.model';
import { CartItem } from '@app/core/models/cartItem.model';
import { CartService } from '@app/core/services/cart/cart.service';

@Component({
  selector: 'app-product-item',
  imports: [CurrencyPipe],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  @Input() product!: CartItem;
  cartService = inject(CartService);

  updateQuantity(quantity: number) {
    this.cartService.updateQuantity(this.product.id, quantity);
  }

  removeItem() {
    this.cartService.removeFromCart(this.product.id);
  }
}
