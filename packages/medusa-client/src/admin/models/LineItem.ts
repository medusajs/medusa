/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LineItemAdjustment } from './LineItemAdjustment';
import type { LineItemTaxLine } from './LineItemTaxLine';

/**
 * Line Items represent purchasable units that can be added to a Cart for checkout. When Line Items are purchased they will get copied to the resulting order and can eventually be referenced in Fulfillments and Returns. Line Items may also be created when processing Swaps and Claims.
 */
export type LineItem = {
  /**
   * The cart's ID
   */
  id?: string;
  /**
   * The ID of the Cart that the Line Item belongs to.
   */
  cart_id?: string;
  /**
   * A cart object. Available if the relation `cart` is expanded.
   */
  cart?: Record<string, any>;
  /**
   * The ID of the Order that the Line Item belongs to.
   */
  order_id?: string;
  /**
   * An order object. Available if the relation `order` is expanded.
   */
  order?: Record<string, any>;
  /**
   * The id of the Swap that the Line Item belongs to.
   */
  swap_id?: string;
  /**
   * A swap object. Available if the relation `swap` is expanded.
   */
  swap?: Record<string, any>;
  /**
   * The id of the Claim that the Line Item belongs to.
   */
  claim_order_id?: string;
  /**
   * A claim order object. Available if the relation `claim_order` is expanded.
   */
  claim_order?: Record<string, any>;
  /**
   * Available if the relation `tax_lines` is expanded.
   */
  tax_lines?: Array<LineItemTaxLine>;
  /**
   * Available if the relation `adjustments` is expanded.
   */
  adjustments?: Array<LineItemAdjustment>;
  /**
   * The title of the Line Item, this should be easily identifiable by the Customer.
   */
  title: string;
  /**
   * A more detailed description of the contents of the Line Item.
   */
  description?: string;
  /**
   * A URL string to a small image of the contents of the Line Item.
   */
  thumbnail?: string;
  /**
   * Is the item being returned
   */
  is_return?: boolean;
  /**
   * Flag to indicate if the Line Item is a Gift Card.
   */
  is_giftcard?: boolean;
  /**
   * Flag to indicate if new Line Items with the same variant should be merged or added as an additional Line Item.
   */
  should_merge?: boolean;
  /**
   * Flag to indicate if the Line Item should be included when doing discount calculations.
   */
  allow_discounts?: boolean;
  /**
   * Flag to indicate if the Line Item has fulfillment associated with it.
   */
  has_shipping?: boolean;
  /**
   * The price of one unit of the content in the Line Item. This should be in the currency defined by the Cart/Order/Swap/Claim that the Line Item belongs to.
   */
  unit_price: boolean;
  /**
   * The id of the Product Variant contained in the Line Item.
   */
  variant_id?: string;
  /**
   * A product variant object. The Product Variant contained in the Line Item. Available if the relation `variant` is expanded.
   */
  variant?: Record<string, any>;
  /**
   * The quantity of the content in the Line Item.
   */
  quantity: number;
  /**
   * The quantity of the Line Item that has been fulfilled.
   */
  fulfilled_quantity?: number;
  /**
   * The quantity of the Line Item that has been returned.
   */
  returned_quantity?: number;
  /**
   * The quantity of the Line Item that has been shipped.
   */
  shipped_quantity?: number;
  /**
   * The amount that can be refunded from the given Line Item. Takes taxes and discounts into consideration.
   */
  refundable?: number;
  /**
   * The subtotal of the line item
   */
  subtotal?: number;
  /**
   * The total of tax of the line item
   */
  tax_total?: number;
  /**
   * The total amount of the line item
   */
  total?: number;
  /**
   * The original total amount of the line item
   */
  original_total?: number;
  /**
   * The original tax total amount of the line item
   */
  original_tax_total?: number;
  /**
   * The total of discount of the line item
   */
  discount_total?: number;
  /**
   * The total of the gift card of the line item
   */
  gift_card_total?: number;
  /**
   * [EXPERIMENTAL] Indicates if the line item unit_price include tax
   */
  includes_tax?: boolean;
  /**
   * [EXPERIMENTAL] The id of the original line item
   */
  original_item_id?: string;
  /**
   * [EXPERIMENTAL] The ID of the order edit to which a cloned item belongs
   */
  order_edit_id?: string;
  /**
   * [EXPERIMENTAL] The order edit joined
   */
  order_edit?: Record<string, any>;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
};

