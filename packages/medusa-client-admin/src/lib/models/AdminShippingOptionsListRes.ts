/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ShippingOption } from './ShippingOption';

export type AdminShippingOptionsListRes = {
  shipping_options?: Array<ShippingOption>;
  /**
   * The total number of items available
   */
  count?: number;
};

