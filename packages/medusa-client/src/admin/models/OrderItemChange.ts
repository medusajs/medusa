/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LineItem } from './LineItem';
import type { OrderEdit } from './OrderEdit';

/**
 * Represents an order edit item change
 */
export type OrderItemChange = {
  /**
   * The order item change's ID
   */
  id?: string;
  /**
   * The order item change's status
   */
  type: 'item_add' | 'item_remove' | 'item_update';
  /**
   * The ID of the order edit
   */
  order_edit_id: string;
  /**
   * Available if the relation `order_edit` is expanded.
   */
  order_edit?: OrderEdit;
  /**
   * The ID of the original line item in the order
   */
  original_line_item_id?: string;
  /**
   * Available if the relation `original_line_item` is expanded.
   */
  original_line_item?: LineItem;
  /**
   * The ID of the cloned line item.
   */
  line_item_id?: string;
  /**
   * Available if the relation `line_item` is expanded.
   */
  line_item?: LineItem;
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
};

