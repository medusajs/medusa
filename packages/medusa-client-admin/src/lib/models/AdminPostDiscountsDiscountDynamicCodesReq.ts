/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostDiscountsDiscountDynamicCodesReq = {
  /**
   * A unique code that will be used to redeem the Discount
   */
  code: string;
  /**
   * Maximum times the discount can be used
   */
  usage_limit?: number;
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>;
};

