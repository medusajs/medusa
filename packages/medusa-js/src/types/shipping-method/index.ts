import { Cart } from '../cart';
import { Order } from '../order';
import { Return } from '../return';
import { Swap } from '../swap';

export interface ShippingMethod {
  id: string;
  shipping_option_id: string;
  shipping_option: ShippingOption;
  order_id?: string;
  order?: Order;
  cart_id?: string;
  cart?: Cart;
  swap_id?: string;
  swap?: Swap;
  return_id?: string;
  return_order?: Return;
  price: number;
  data: JSON;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ShippingOption {
  option_id: string;
  data?: JSON;
}
