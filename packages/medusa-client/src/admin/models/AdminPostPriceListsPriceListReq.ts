/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostPriceListsPriceListReq = {
  /**
   * The name of the Price List
   */
  name: string;
  /**
   * A description of the Price List.
   */
  description: string;
  /**
   * The date with timezone that the Price List starts being valid.
   */
  starts_at?: string;
  /**
   * The date with timezone that the Price List ends being valid.
   */
  ends_at?: string;
  /**
   * The type of the Price List.
   */
  type: 'sale' | 'override';
  /**
   * The status of the Price List.
   */
  status?: 'active' | 'draft';
  /**
   * The prices of the Price List.
   */
  prices: Array<any>;
  /**
   * A list of customer groups that the Price List applies to.
   */
  customer_groups?: Array<any>;
  /**
   * [EXPERIMENTAL] Tax included in prices of price list
   */
  includes_tax?: boolean;
};

