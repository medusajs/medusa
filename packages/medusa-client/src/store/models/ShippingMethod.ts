/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ShippingMethodTaxLine } from './ShippingMethodTaxLine';
import type { ShippingOption } from './ShippingOption';

/**
 * Shipping Methods represent a way in which an Order or Return can be shipped. Shipping Methods are built from a Shipping Option, but may contain additional details, that can be necessary for the Fulfillment Provider to handle the shipment.
 */
export type ShippingMethod = {
  /**
   * The shipping method's ID
   */
  id?: string;
  /**
   * The id of the Shipping Option that the Shipping Method is built from.
   */
  shipping_option_id: string;
  /**
   * Available if the relation `shipping_option` is expanded.
   */
  shipping_option?: ShippingOption;
  /**
   * The id of the Order that the Shipping Method is used on.
   */
  order_id?: string;
  /**
   * An order object. Available if the relation `order` is expanded.
   */
  order?: Record<string, any>;
  /**
   * The id of the Return that the Shipping Method is used on.
   */
  return_id?: string;
  /**
   * A return object. Available if the relation `return_order` is expanded.
   */
  return_order?: Record<string, any>;
  /**
   * The id of the Swap that the Shipping Method is used on.
   */
  swap_id?: string;
  /**
   * A swap object. Available if the relation `swap` is expanded.
   */
  swap?: Record<string, any>;
  /**
   * The id of the Cart that the Shipping Method is used on.
   */
  cart_id?: string;
  /**
   * A cart object. Available if the relation `cart` is expanded.
   */
  cart?: Record<string, any>;
  /**
   * The id of the Claim that the Shipping Method is used on.
   */
  claim_order_id?: string;
  /**
   * A claim order object. Available if the relation `claim_order` is expanded.
   */
  claim_order?: Record<string, any>;
  /**
   * Available if the relation `tax_lines` is expanded.
   */
  tax_lines?: Array<ShippingMethodTaxLine>;
  /**
   * The amount to charge for the Shipping Method. The currency of the price is defined by the Region that the Order that the Shipping Method belongs to is a part of.
   */
  price: number;
  /**
   * Additional data that the Fulfillment Provider needs to fulfill the shipment. This is used in combination with the Shipping Options data, and may contain information such as a drop point id.
   */
  data?: Record<string, any>;
  /**
   * [EXPERIMENTAL] Indicates if the shipping method price include tax
   */
  includes_tax?: boolean;
};

