import { Address } from '../address';
import { Cart } from '../cart';
import { LineItem } from '../line-item';
import { Fulfillment, FulfillmentStatus, Order, PaymentStatus } from '../order';
import { Payment } from '../payment';
import { Return } from '../return';
import { ShippingMethod } from '../shipping-method';

export interface Swap {
  id: string;
  fulfillment_status: FulfillmentStatus;
  payment_status: PaymentStatus;
  order_id?: string;
  order?: Order;
  additional_items?: LineItem;
  return_order?: Return;
  fulfillments?: Fulfillment[];
  payment?: Payment;
  shipping_address_id?: string;
  shipping_address?: Address;
  shipping_methods?: ShippingMethod[];
  cart_id?: string;
  cart?: Cart;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
  idempotency_key: string;
}
