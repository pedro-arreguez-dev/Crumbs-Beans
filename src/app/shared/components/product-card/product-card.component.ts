import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@app/core/models/products.model';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<any>();

  add(event: Event) {
    this.addToCart.emit(this.product);
  }
}
