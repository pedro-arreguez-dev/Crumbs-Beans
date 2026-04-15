import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartService } from './core/services/cart/cart.service';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'coffee-app';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    // esperar un tick para que initAuth termine
    setTimeout(async () => {
      await this.cartService.initCart();
    }, 0);
  }
}
