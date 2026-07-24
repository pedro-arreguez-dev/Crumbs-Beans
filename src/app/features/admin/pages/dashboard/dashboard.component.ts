import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersService } from '@app/core/services/orders/orders.service';
import { Order } from '@app/core/models/orders.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private ordersService = inject(OrdersService);

  orders = signal<Order[]>([]);
  loading = signal(true);
  loadingUpdateStatus = signal(false);

  // Filters & State
  statusFilter = signal<string>('All');
  searchQuery = signal<string>('');
  expandedOrders = signal<Set<string | number>>(new Set());

  // Filtered Orders List
  filteredOrders = computed(() => {
    let list = this.orders();
    const filter = this.statusFilter();
    const query = this.searchQuery().toLowerCase().trim();

    if (filter !== 'All') {
      list = list.filter(o => o.status.toLowerCase() === filter.toLowerCase());
    }

    if (query) {
      list = list.filter(o => 
        String(o.id).toLowerCase().includes(query) || 
        o.user_id.toLowerCase().includes(query)
      );
    }

    return list;
  });

  // Statistics Signals
  totalOrders = computed(() => this.orders().length);
  
  pendingOrders = computed(() => 
    this.orders().filter(o => o.status.toLowerCase() === 'pending').length
  );
  
  completedOrders = computed(() => 
    this.orders().filter(o => o.status.toLowerCase() === 'completed').length
  );
  
  totalRevenue = computed(() => 
    this.orders()
      .filter(o => o.status.toLowerCase() === 'completed')
      .reduce((sum, o) => sum + o.total, 0)
  );

  async ngOnInit() {
    await this.loadOrders();
  }

  async loadOrders() {
    try {
      this.loading.set(true);
      const data = await this.ordersService.getAllOrders();
      this.orders.set(data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      this.loading.set(false);
    }
  }

  async updateStatus(id: any, status: string) {
    try {
      this.loadingUpdateStatus.set(true);
      await this.ordersService.updateStatus(id, status);
      const data = await this.ordersService.getAllOrders();
      this.orders.set(data);
    } catch (error) {
      console.error('Failed to update order status', error);
    } finally {
      this.loadingUpdateStatus.set(false);
    }
  }

  // Expansion & Formatting Helpers
  isExpanded(id: string | number): boolean {
    return this.expandedOrders().has(id);
  }

  toggleOrder(id: string | number) {
    this.expandedOrders.update(set => {
      const newSet = new Set(set);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  formatOrderId(id: string | number): string {
    const idStr = String(id);
    if (idStr.length >= 4) return idStr;
    return idStr.padStart(4, '0');
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    if (s === 'completed') return 'status-completed';
    if (s === 'preparing') return 'status-preparing';
    if (s === 'ready') return 'status-ready';
    if (s === 'pending') return 'status-pending';
    if (s === 'cancelled') return 'status-cancelled';
    return 'status-default';
  }
}
