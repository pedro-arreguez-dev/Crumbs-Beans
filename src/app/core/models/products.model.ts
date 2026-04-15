import { Category } from './categories.model';

export interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  vegan: boolean;
  img_path: string;
  price: number;
  created_at: string;

  category_name?: string;
}
