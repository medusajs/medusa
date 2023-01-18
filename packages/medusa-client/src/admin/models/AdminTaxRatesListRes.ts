/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TaxRate } from './TaxRate';

export type AdminTaxRatesListRes = {
  tax_rates?: Array<TaxRate>;
  /**
   * The total number of items available
   */
  count?: number;
  /**
   * The number of items skipped before these items
   */
  offset?: number;
  /**
   * The number of items per page
   */
  limit?: number;
};

