import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Order } from '@app/core/models/orders.model';
import { OrdersService } from '@app/core/services/orders/orders.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  ordersService = inject(OrdersService);
  
  orders = signal<Order[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  async ngOnInit() {
    try {
      this.loading.set(true);
      const data = await this.ordersService.getOrders();
      this.orders.set(data);
      this.error.set(null);
    } catch (err) {
      console.error('Failed to load orders', err);
      this.error.set('Failed to load your order history. Please try again later.');
    } finally {
      this.loading.set(false);
    }
  }

  isExpanded(orderId: string | number): boolean {
    return this.expandedOrderId() === orderId;
  }

  expandedOrderId = signal<string | number | null>(null);

  toggleOrder(orderId: string | number) {
    if (this.expandedOrderId() === orderId) {
      this.expandedOrderId.set(null);
    } else {
      this.expandedOrderId.set(orderId);
    }
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('delivered') || s.includes('completed')) return 'status-completed';
    if (s.includes('pending') || s.includes('processing')) return 'status-pending';
    if (s.includes('cancelled') || s.includes('failed')) return 'status-cancelled';
    return 'status-default';
  }

  formatOrderId(id: string | number): string {
    if (typeof id === 'string' && id.length > 8) {
      return id.substring(0, 8).toUpperCase();
    }
    return String(id);
  }
}

