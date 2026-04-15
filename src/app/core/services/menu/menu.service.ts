import { Injectable } from '@angular/core';
import { supabase, getProductImageUrl } from '../supabase.client';
import { Product } from '../../models/products.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select(`
        *,
        category:category_id (
          name
        )
      `);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const mapped = data.map((p: any) => ({
      ...p,
      category_name: p.category?.name ?? '',
      img_path: getProductImageUrl(p.img_path),
    }));

    return mapped as Product[];
  }
}
