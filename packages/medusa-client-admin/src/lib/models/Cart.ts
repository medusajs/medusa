/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';
import type { LineItem } from './LineItem';
import type { Payment } from './Payment';
import type { PaymentSession } from './PaymentSession';
import type { ShippingMethod } from './ShippingMethod';

/**
 * Represents a user cart
 */
export type Cart = {
  /**
   * The cart's ID
   */
  id?: string;
  /**
   * The email associated with the cart
   */
  email?: string;
  /**
   * The billing address's ID
   */
  billing_address_id?: string;
  /**
   * Available if the relation `billing_address` is expanded.
   */
  billing_address?: Address;
  /**
   * The shipping address's ID
   */
  shipping_address_id?: string;
  /**
   * Available if the relation `shipping_address` is expanded.
   */
  shipping_address?: Address;
  /**
   * Available if the relation `items` is expanded.
   */
  items?: Array<LineItem>;
  /**
   * The region's ID
   */
  region_id?: string;
  /**
   * A region object. Available if the relation `region` is expanded.
   */
  region?: Record<string, any>;
  /**
   * Available if the relation `discounts` is expanded.
   */
  discounts?: Array<Record<string, any>>;
  /**
   * Available if the relation `gift_cards` is expanded.
   */
  gift_cards?: Array<Record<string, any>>;
  /**
   * The customer's ID
   */
  customer_id?: string;
  /**
   * A customer object. Available if the relation `customer` is expanded.
   */
  customer?: Record<string, any>;
  /**
   * The selected payment session in the cart.
   */
  payment_session?: PaymentSession;
  /**
   * The payment sessions created on the cart.
   */
  payment_sessions?: Array<PaymentSession>;
  /**
   * The payment's ID if available
   */
  payment_id?: string;
  /**
   * Available if the relation `payment` is expanded.
   */
  payment?: Payment;
  /**
   * The shipping methods added to the cart.
   */
  shipping_methods?: Array<ShippingMethod>;
  /**
   * The cart's type.
   */
  type?: 'default' | 'swap' | 'draft_order' | 'payment_link' | 'claim';
  /**
   * The date with timezone at which the cart was completed.
   */
  completed_at?: string;
  /**
   * The date with timezone at which the payment was authorized.
   */
  payment_authorized_at?: string;
  /**
   * Randomly generated key used to continue the completion of a cart in case of failure.
   */
  idempotency_key?: string;
  /**
   * The context of the cart which can include info like IP or user agent.
   */
  context?: Record<string, any>;
  /**
   * The sales channel ID the cart is associated with.
   */
  sales_channel_id?: string;
  /**
   * A sales channel object. Available if the relation `sales_channel` is expanded.
   */
  sales_channel?: Record<string, any>;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string;
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
  /**
   * The total of shipping
   */
  shipping_total?: number;
  /**
   * The total of discount
   */
  discount_total?: number;
  /**
   * The total of tax
   */
  tax_total?: number;
  /**
   * The total amount refunded if the order associated with this cart is returned.
   */
  refunded_total?: number;
  /**
   * The total amount of the cart
   */
  total?: number;
  /**
   * The subtotal of the cart
   */
  subtotal?: number;
  /**
   * The amount that can be refunded
   */
  refundable_amount?: number;
  /**
   * The total of gift cards
   */
  gift_card_total?: number;
  /**
   * The total of gift cards with taxes
   */
  gift_card_tax_total?: number;
};

