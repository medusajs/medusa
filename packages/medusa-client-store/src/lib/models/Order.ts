/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';
import type { Currency } from './Currency';
import type { Fulfillment } from './Fulfillment';
import type { GiftCardTransaction } from './GiftCardTransaction';
import type { LineItem } from './LineItem';
import type { OrderEdit } from './OrderEdit';
import type { Payment } from './Payment';
import type { ShippingMethod } from './ShippingMethod';

/**
 * Represents an order
 */
export type Order = {
  /**
   * The order's ID
   */
  id?: string;
  /**
   * The order's status
   */
  status?: 'pending' | 'completed' | 'archived' | 'canceled' | 'requires_action';
  /**
   * The order's fulfillment status
   */
  fulfillment_status?: 'not_fulfilled' | 'partially_fulfilled' | 'fulfilled' | 'partially_shipped' | 'shipped' | 'partially_returned' | 'returned' | 'canceled' | 'requires_action';
  /**
   * The order's payment status
   */
  payment_status?: 'not_paid' | 'awaiting' | 'captured' | 'partially_refunded' | 'refuneded' | 'canceled' | 'requires_action';
  /**
   * The order's display ID
   */
  display_id?: number;
  /**
   * The ID of the cart associated with the order
   */
  cart_id?: string;
  /**
   * A cart object. Available if the relation `cart` is expanded.
   */
  cart?: Record<string, any>;
  /**
   * The ID of the customer associated with the order
   */
  customer_id: string;
  /**
   * A customer object. Available if the relation `customer` is expanded.
   */
  customer?: Record<string, any>;
  /**
   * The email associated with the order
   */
  email: string;
  /**
   * The ID of the billing address associated with the order
   */
  billing_address_id?: string;
  /**
   * Available if the relation `billing_address` is expanded.
   */
  billing_address?: Address;
  /**
   * The ID of the shipping address associated with the order
   */
  shipping_address_id?: string;
  /**
   * Available if the relation `shipping_address` is expanded.
   */
  shipping_address?: Address;
  /**
   * The region's ID
   */
  region_id: string;
  /**
   * A region object. Available if the relation `region` is expanded.
   */
  region?: Record<string, any>;
  /**
   * The 3 character currency code that is used in the order
   */
  currency_code: string;
  /**
   * Available if the relation `currency` is expanded.
   */
  currency?: Currency;
  /**
   * The order's tax rate
   */
  tax_rate?: number;
  /**
   * The discounts used in the order. Available if the relation `discounts` is expanded.
   */
  discounts?: Array<Record<string, any>>;
  /**
   * The gift cards used in the order. Available if the relation `gift_cards` is expanded.
   */
  gift_cards?: Array<Record<string, any>>;
  /**
   * The shipping methods used in the order. Available if the relation `shipping_methods` is expanded.
   */
  shipping_methods?: Array<ShippingMethod>;
  /**
   * The payments used in the order. Available if the relation `payments` is expanded.
   */
  payments?: Array<Payment>;
  /**
   * The fulfillments used in the order. Available if the relation `fulfillments` is expanded.
   */
  fulfillments?: Array<Fulfillment>;
  /**
   * The returns associated with the order. Available if the relation `returns` is expanded.
   */
  returns?: Array<Record<string, any>>;
  /**
   * The claims associated with the order. Available if the relation `claims` is expanded.
   */
  claims?: Array<Record<string, any>>;
  /**
   * The refunds associated with the order. Available if the relation `refunds` is expanded.
   */
  refunds?: Array<Record<string, any>>;
  /**
   * The swaps associated with the order. Available if the relation `swaps` is expanded.
   */
  swaps?: Array<Record<string, any>>;
  /**
   * The ID of the draft order this order is associated with.
   */
  draft_order_id?: string;
  /**
   * A draft order object. Available if the relation `draft_order` is expanded.
   */
  draft_order?: Record<string, any>;
  /**
   * The line items that belong to the order. Available if the relation `items` is expanded.
   */
  items?: Array<LineItem>;
  /**
   * [EXPERIMENTAL] Order edits done on the order. Available if the relation `edits` is expanded.
   */
  edits?: Array<OrderEdit>;
  /**
   * The gift card transactions used in the order. Available if the relation `gift_card_transactions` is expanded.
   */
  gift_card_transactions?: Array<GiftCardTransaction>;
  /**
   * The date the order was canceled on.
   */
  canceled_at?: string;
  /**
   * Flag for describing whether or not notifications related to this should be send.
   */
  no_notification?: boolean;
  /**
   * Randomly generated key used to continue the processing of the order in case of failure.
   */
  idempotency_key?: string;
  /**
   * The ID of an external order.
   */
  external_id?: string;
  /**
   * The ID of the sales channel this order is associated with.
   */
  sales_channel_id?: string;
  /**
   * A sales channel object. Available if the relation `sales_channel` is expanded.
   */
  sales_channel?: Record<string, any>;
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
   * The total amount refunded if the order is returned.
   */
  refunded_total?: number;
  /**
   * The total amount of the order
   */
  total?: number;
  /**
   * The subtotal of the order
   */
  subtotal?: number;
  /**
   * The total amount paid
   */
  paid_total?: number;
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

