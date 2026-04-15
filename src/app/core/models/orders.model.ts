export interface OrderItem {
  id: string | number;
  order_id: string | number;
  product_id: string | number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string | number;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}
