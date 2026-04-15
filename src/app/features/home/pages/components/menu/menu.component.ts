import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../../../core/services/menu/menu.service';
import { CartService } from '@app/core/services/cart/cart.service';
import { Product } from '@app/core/models/products.model';
import { ProductCardComponent } from '@app/shared/components/product-card/product-card.component';
import { MenuFiltersComponent } from './menu-filters/menu-filters.component';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, ProductCardComponent, MenuFiltersComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  products = signal<Product[]>([]);
  visibleCount = signal(6);
  loading = true;
  error = false;
  selectedCategory = signal<string>('all');
  filters = signal({
    vegan: false,
    search: '',
  });

  showToast = signal(false);
  toastProductName = signal('');

  visibleProducts = computed(() => {
    return this.filteredProducts().slice(0, this.visibleCount());
  });

  filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const products = this.products();
    const filters = this.filters();

    const filter = products.filter((p) => {
      const matchCategory = category === 'all' || p.category_name === category;

      const matchVegan = !filters.vegan || p.vegan === true;

      const matchSearch = p.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      return matchCategory && matchVegan && matchSearch;
    });
    return filter;
  });

  constructor(
    private menuService: MenuService,
    private cartService: CartService,
  ) {}

  async ngOnInit() {
    try {
      const data = await this.menuService.getProducts();
      this.products.set(data);
    } catch (err) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  loadMore() {
    this.visibleCount.update((count) => count + 9);
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
    this.toastProductName.set(product.name);
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }
}
