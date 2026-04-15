import { Component, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '@app/core/services/cart/cart.service';
import { OrdersService } from '@app/core/services/orders/orders.service';
import { Router } from '@angular/router';
import { ProductItemComponent } from '../../components/product-item/product-item.component';
import { CartItem } from '@app/core/models/cartItem.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [ProductItemComponent, CurrencyPipe, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  cartService = inject(CartService);
  products = this.cartService.cartItems;
  loading = false;
  error = false;

  subtotal = computed(() => {
    return this.products().reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  isPaymentDropdownOpen = signal(false);
  selectedPayment = signal('Card');

  discount = signal(0);

  total = computed(() => {
    return this.subtotal() - this.discount();
  });

  togglePaymentDropdown() {
    this.isPaymentDropdownOpen.update(v => !v);
  }

  selectPaymentMethod(method: string) {
    this.selectedPayment.set(method);
    this.isPaymentDropdownOpen.set(false);
  }

  ordersService = inject(OrdersService);
  router = inject(Router);

  async onPlaceOrder() {
    this.loading = true;
    try {
      if (this.products().length === 0) return;
      await this.ordersService.placeOrder(this.products(), this.total());
      await this.cartService.clearCart();
      this.router.navigate(['/orders']);
    } catch (err) {
      console.error('Checkout failed', err);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
}
