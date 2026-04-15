import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartComponent } from '../cart/cart.component';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, CartComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthService);

  isCartOpen = signal(false);
  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);

  get user() {
    return this.authService.user();
  }

  toggleCart(event: Event) {
    event.preventDefault();
    this.isCartOpen.update(v => !v);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  toggleUserMenu(event: Event) {
    event.preventDefault();
    this.isUserMenuOpen.update(v => !v);
  }

  async logout() {
    this.isUserMenuOpen.set(false);
    await this.authService.logout();
  }
}
