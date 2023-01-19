/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';

export type StorePostCartsCartReq = {
  /**
   * The id of the Region to create the Cart in.
   */
  region_id?: string;
  /**
   * The 2 character ISO country code to create the Cart in.
   */
  country_code?: string;
  /**
   * An email to be used on the Cart.
   */
  email?: string;
  /**
   * The ID of the Sales channel to update the Cart with.
   */
  sales_channel_id?: string;
  /**
   * The Address to be used for billing purposes.
   */
  billing_address?: (Address | string);
  /**
   * The Address to be used for shipping.
   */
  shipping_address?: (Address | string);
  /**
   * An array of Gift Card codes to add to the Cart.
   */
  gift_cards?: Array<any>;
  /**
   * An array of Discount codes to add to the Cart.
   */
  discounts?: Array<any>;
  /**
   * The ID of the Customer to associate the Cart with.
   */
  customer_id?: string;
  /**
   * An optional object to provide context to the Cart.
   */
  context?: Record<string, any>;
};

