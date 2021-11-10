import { Address } from '../address';
import { Cart } from '../cart';
import { Customer } from '../customer';
import { Discount } from '../discount';
import { GiftCard } from '../gift-card';
import { LineItem } from '../line-item';
import { Payment } from '../payment';
import { Currency } from '../product-variant';
import { Region } from '../region';
import { ShippingMethod } from '../shipping-method';

export interface Order {
  id: string;
  status: OrderStatus;
  fulfillment_status: FulfillmentStatus;
  payment_status: PaymentStatus;
  display_id: number;
  cart_id?: string;
  cart?: Cart;
  customer_id?: string;
  customer?: Customer;
  email: string;
  billing_address_id?: string;
  billing_address?: Address;
  shipping_address_id?: string;
  shipping_address?: Address;
  region_id?: string;
  region?: Region;
  currency_code: string;
  currency: Currency;
  tax_rate: number;
  discounts?: Discount[];
  gift_cards?: GiftCard[];
  shipping_methods?: ShippingMethod[];
  payments?: Payment[];
  fulfillments?: Fulfillment[];
  items: LineItem[];
  canceled_at?: Date;
  created_at: Date;
  updated_at: Date;
  metadata?: JSON;

  // Total fields
  shipping_total: number;
  discount_total: number;
  tax_total: number;
  refunded_total: number;
  total: number;
  subtotal: number;
  paid_total: number;
  refundable_amount: number;
  gift_card_total: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  CANCELED = 'canceled',
  REQUIRES_ACTION = 'requires_action',
}

export enum FulfillmentStatus {
  NOT_FULFILLED = 'not_fulfilled',
  PARTIALLY_FULFILLED = 'partially_fulfilled',
  FULFILLED = 'fulfilled',
  PARTIALLY_SHIPPED = 'partially_shipped',
  SHIPPED = 'shipped',
  PARTIALLY_RETURNED = 'partially_returned',
  RETURNED = 'returned',
  CANCELED = 'canceled',
  REQUIRES_ACTION = 'requires_action',
}

export enum PaymentStatus {
  NOT_PAID = 'not_paid',
  AWAITING = 'awaiting',
  CAPTURED = 'captured',
  PARTIALLY_REFUNDED = 'partially_refunded',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
  REQUIRES_ACTION = 'requires_action',
}

export interface OrderLookUpPayload {
  display_id: number;
  email: string;
  shipping_address?: {
    postal_code: string;
  };
}

export interface Fulfillment {}
