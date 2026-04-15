import { Injectable, signal, effect } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CartItem } from '../../models/cartItem.model';
import { supabase, getProductImageUrl } from '../supabase.client';

import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CartService {
  cartItems = signal<CartItem[]>([]);
  cartId: string | null = null;

  private platformId = inject(PLATFORM_ID);

  constructor(private auth: AuthService) {
    effect(() => {
      const user = this.auth.user();
      if (user) {
        this.loadOrCreateCart(user.id);
      } else {
        this.cartId = null;
        this.cartItems.set([]);
        this.loadLocalCart();
      }
    });
  }

  async initCart() {
    await this.auth.waitForInit();
  }

  loadLocalCart() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('cart');
      if (data) {
        this.cartItems.set(JSON.parse(data));
      }
    }
  }

  async addToCart(product: CartItem) {
    const user = this.auth.user();

    if (user) {
      await this.addToRemoteCart(product);
    } else {
      this.addToLocalCart(product);
    }
  }

  addToLocalCart(product: CartItem) {
    const items = [...this.cartItems()];
    const existingIndex = items.findIndex((p) => String(p.id) === String(product.id));

    if (existingIndex !== -1) {
      items[existingIndex] = { ...items[existingIndex], quantity: items[existingIndex].quantity + 1 };
    } else {
      items.push({ ...product, quantity: 1 });
    }

    this.cartItems.set(items);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }

  async addToRemoteCart(product: CartItem) {
    if (!this.cartId) return;

    // 1. Buscar si ya existe el producto en el carrito
    const { data: existing, error: fetchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', this.cartId)
      .eq('product_id', product.id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error buscando producto en carrito', fetchError);
      return;
    }

    // 2. Si existe actualizar cantidad
    if (existing) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error actualizando cantidad', updateError);
        return;
      }
    } else {
      // 3. Si no existe insertar
      const { error: insertError } = await supabase.from('cart_items').insert([
        {
          cart_id: this.cartId,
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);

      if (insertError) {
        console.error('Error insertando producto', insertError);
        return;
      }
    }

    // 4. Recargar carrito desde DB
    await this.loadCartItems();
  }

  async loadOrCreateCart(userId: string) {
    const { data } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .limit(1);

    if (data && data.length > 0) {
      this.cartId = data[0].id;
      await this.loadCartItems();
    } else {
      const { data: newCart } = await supabase
        .from('carts')
        .insert([{ user_id: userId }])
        .select()
        .single();

      this.cartId = newCart.id;
    }
  }

  async loadCartItems() {
    const { data: cartData, error: cartError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', this.cartId)
      .order('id', { ascending: true });

    if (cartError) {
      console.error('Error loading cart items:', cartError);
      this.cartItems.set([]);
      return;
    }

    if (!cartData || cartData.length === 0) {
      this.cartItems.set([]);
      return;
    }

    const productIds = cartData.map(item => item.product_id);
    const { data: products } = await supabase
      .from('products')
      .select('id, name, price, img_path')
      .in('id', productIds);

    const productMap = new Map();
    if (products) {
      for (const p of products) {
        productMap.set(p.id, p);
      }
    }

    const items = cartData.map((item: any) => {
      const p = productMap.get(item.product_id) || {};
      let imgPath = item.img_path || p.img_path;

      return {
        ...item,
        id: item.product_id, // Ensure id consistently refers to product_id
        cart_item_id: item.id, // Preserve original cart_item id
        name: p.name || item.name,
        price: p.price || item.price,
        img_path: getProductImageUrl(imgPath)
      };
    });

    this.cartItems.set(items);
  }

  async removeFromCart(productId: string | number) {
    const user = this.auth.user();
    if (user) {
      if (!this.cartId) return;
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', this.cartId)
        .eq('product_id', productId);

      if (error) console.error('Error removing from remote cart', error);
      else await this.loadCartItems();
    } else {
      const items = this.cartItems().filter((p) => String(p.id) !== String(productId));
      this.cartItems.set(items);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('cart', JSON.stringify(items));
      }
    }
  }

  async updateQuantity(productId: string | number, quantity: number) {
    if (quantity <= 0) {
      await this.removeFromCart(productId);
      return;
    }

    const user = this.auth.user();
    if (user) {
      if (!this.cartId) return;
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('cart_id', this.cartId)
        .eq('product_id', productId);

      if (error) console.error('Error updating remote cart quantity', error);
      else await this.loadCartItems();
    } else {
      const items = this.cartItems().map((p) =>
        String(p.id) === String(productId) ? { ...p, quantity } : p
      );
      this.cartItems.set(items);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('cart', JSON.stringify(items));
      }
    }
  }

  async clearCart() {
    const user = this.auth.user();
    if (user && this.cartId) {
      const { error } = await supabase.from('cart_items').delete().eq('cart_id', this.cartId);
      if (error) console.error('Error clearing remote cart', error);
      else await this.loadCartItems();
    } else {
      this.cartItems.set([]);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('cart');
      }
    }
  }
}
