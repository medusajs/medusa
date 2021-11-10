import { Cart } from '../cart';
import { Order } from '../order';
import { ProductVariant } from '../product-variant';
import { Swap } from '../swap';

export interface LineItem {
  id: string;
  cart_id?: string;
  cart?: Cart;
  order_id?: string;
  order?: Order;
  swap_id?: string;
  swap?: Swap;
  title: string;
  description?: string;
  thumbnail?: string;
  is_giftcard: boolean;
  should_merge: boolean;
  allow_discounts: boolean;
  has_shipping: boolean;
  unit_price: number;
  variant_id?: string;
  variant?: ProductVariant;
  quantity: number;
  fulfilled_quantity?: number;
  returned_quantity?: number;
  shipped_quantity?: number;
  created_at?: Date;
  updated_at?: Date;
  metadata?: JSON;

  refundable: number;
}

export interface LineItemCreatePayload {
  variant_id: string;
  quantity: number;
  metadata?: JSON;
}

export interface LineItemUpdatePayload {
  quantity?: number;
}
