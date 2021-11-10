import { Address } from '../address';
import { Customer } from '../customer';
import { Discount } from '../discount';
import { GiftCard } from '../gift-card';
import { LineItem } from '../line-item';
import { Order } from '../order';
import { Swap } from '../swap';
import { Payment } from '../payment';
import { Region } from '../region';
import { ShippingMethod } from '../shipping-method';

export interface Cart {
  id: string;
  email?: string;
  billing_address_id?: string;
  billing_address?: Address;
  shipping_address_id?: string;
  shipping_address?: Address;
  items: LineItem[];
  region: Region;
  discounts: Discount[];
  gift_cards: GiftCard[];
  customer_id?: string;
  customer?: Customer;
  payment_session?: PaymentSession;
  payment_sessions?: PaymentSession[];
  payment_id?: string;
  payment?: Payment;
  shipping_methods?: ShippingMethod[];
  is_swap: boolean;
  type: CartType;
  idempotency_key: string;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
  context?: JSON;

  // Total fields
  shipping_total: number;
  discount_total: number;
  tax_total: number;
  refunded_total: number;
  total: number;
  subtotal: number;
  refundable_amount: number;
  gift_card_total: number;
}

export interface CompleteCartResponse {
  data: Order | Cart | Swap;
  type: "order" | "cart" | "swap";
  payment_status?: string;
}

export enum CartType {
  DEFAULT = 'default',
  SWAP = 'swap',
  PAYMENT_LINK = 'payment_link',
}

export interface CartCreateResource {
  region_id?: string;
  items?: LineItem[];
}

export interface CartUpdateResource {
  region_id?: string;
  email?: string;
  billing_address?: string;
  shipping_addres?: Address;
}

export interface PaymentSession {
  id: string;
  cart_id: string;
  cart: Cart;
  provider_id: string;
  is_selected?: boolean;
  status: string;
  data?: JSON;
  created_at: Date;
  updated_at: Date;
  idempotency_key: string;
}
