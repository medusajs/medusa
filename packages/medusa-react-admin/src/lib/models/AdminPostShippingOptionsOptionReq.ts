/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostShippingOptionsOptionReq = {
  /**
   * The name of the Shipping Option
   */
  name?: string;
  /**
   * The amount to charge for the Shipping Option.
   */
  amount?: number;
  /**
   * If true, the option can be used for draft orders
   */
  admin_only?: boolean;
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>;
  /**
   * The requirements that must be satisfied for the Shipping Option to be available.
   */
  requirements: Array<any>;
  /**
   * [EXPERIMENTAL] Tax included in prices of shipping option
   */
  includes_tax?: boolean;
};

