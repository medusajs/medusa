/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Custom Shipping Options are 'overriden' Shipping Options. Store managers can attach a Custom Shipping Option to a cart in order to set a custom price for a particular Shipping Option
 */
export type CustomShippingOption = {
  /**
   * The custom shipping option's ID
   */
  id?: string;
  /**
   * The custom price set that will override the shipping option's original price
   */
  price: number;
  /**
   * The ID of the Shipping Option that the custom shipping option overrides
   */
  shipping_option_id: string;
  /**
   * A shipping option object. Available if the relation `shipping_option` is expanded.
   */
  shipping_option?: Record<string, any>;
  /**
   * The ID of the Cart that the custom shipping option is attached to
   */
  cart_id?: string;
  /**
   * A cart object. Available if the relation `cart` is expanded.
   */
  cart?: Record<string, any>;
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
   * [EXPERIMENTAL] Indicates if the custom shipping option price include tax
   */
  includes_tax?: boolean;
};

