/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LineItem } from './LineItem';
import type { Order } from './Order';
import type { OrderItemChange } from './OrderItemChange';
import type { PaymentCollection } from './PaymentCollection';

/**
 * Order edit keeps track of order items changes.
 */
export type OrderEdit = {
  /**
   * The order edit's ID
   */
  id?: string;
  /**
   * The ID of the order that is edited
   */
  order_id: string;
  /**
   * Available if the relation `order` is expanded.
   */
  order: Order;
  /**
   * Available if the relation `changes` is expanded.
   */
  changes: Array<OrderItemChange>;
  /**
   * An optional note with additional details about the order edit.
   */
  internal_note?: string;
  /**
   * The unique identifier of the user or customer who created the order edit.
   */
  created_by: string;
  /**
   * The unique identifier of the user or customer who requested the order edit.
   */
  requested_by?: string;
  /**
   * The date with timezone at which the edit was requested.
   */
  requested_at?: string;
  /**
   * The unique identifier of the user or customer who confirmed the order edit.
   */
  confirmed_by?: string;
  /**
   * The date with timezone at which the edit was confirmed.
   */
  confirmed_at?: string;
  /**
   * The unique identifier of the user or customer who declined the order edit.
   */
  declined_by?: string;
  /**
   * The date with timezone at which the edit was declined.
   */
  declined_at?: string;
  /**
   * An optional note why  the order edit is declined.
   */
  declined_reason?: string;
  /**
   * The total of subtotal
   */
  subtotal?: number;
  /**
   * The total of discount
   */
  discount_total?: number;
  /**
   * The total of the shipping amount
   */
  shipping_total?: number;
  /**
   * The total of the gift card amount
   */
  gift_card_total?: number;
  /**
   * The total of the gift card tax amount
   */
  gift_card_tax_total?: number;
  /**
   * The total of tax
   */
  tax_total?: number;
  /**
   * The total amount of the edited order.
   */
  total?: number;
  /**
   * The difference between the total amount of the order and total amount of edited order.
   */
  difference_due?: number;
  /**
   * The status of the order edit.
   */
  status?: 'confirmed' | 'declined' | 'requested' | 'created' | 'canceled';
  /**
   * Available if the relation `items` is expanded.
   */
  items?: Array<LineItem>;
  /**
   * The ID of the payment collection
   */
  payment_collection_id?: string;
  /**
   * Available if the relation `payment_collection` is expanded.
   */
  payment_collection?: PaymentCollection;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
};

