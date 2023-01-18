/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LineItem } from './LineItem';

/**
 * Correlates a Line Item with a Fulfillment, keeping track of the quantity of the Line Item.
 */
export type FulfillmentItem = {
  /**
   * The id of the Fulfillment that the Fulfillment Item belongs to.
   */
  fulfillment_id: string;
  /**
   * The id of the Line Item that the Fulfillment Item references.
   */
  item_id: string;
  /**
   * A fulfillment object. Available if the relation `fulfillment` is expanded.
   */
  fulfillment?: Record<string, any>;
  /**
   * Available if the relation `item` is expanded.
   */
  item?: LineItem;
  /**
   * The quantity of the Line Item that is included in the Fulfillment.
   */
  quantity: number;
};

