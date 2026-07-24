import { Injectable, inject } from '@angular/core';
import { supabase } from '../supabase.client';
import { Order } from '../../models/orders.model';
import { CartItem } from '../../models/cartItem.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private auth = inject(AuthService);

  async getOrders(): Promise<Order[]> {
    await this.auth.waitForInit();
    const user = this.auth.user();
    if (!user) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return data as Order[];
  }

  async getAllOrders(): Promise<Order[]> {
    await this.auth.waitForInit();
    const user = this.auth.user();
    if (!user) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }

    return data as Order[];
  }

  async placeOrder(cartItems: CartItem[], total: number): Promise<Order> {
    const user = this.auth.user();
    if (!user) throw new Error('User must be logged in to place an order');

    // 1. Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        { user_id: user.id, total, status: 'Pending' }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items
    const orderItemsToInsert = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) throw itemsError;

    return order as Order;
  }

  async updateStatus(id: string | number, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return data as Order;
  }
}
