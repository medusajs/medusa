/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StoreGetShippingOptionsParams = {
  /**
   * Whether return Shipping Options should be included. By default all Shipping Options are returned.
   */
  isReturn?: boolean;
  /**
   * A comma separated list of Product ids to filter Shipping Options by.
   */
  productIds?: string;
  /**
   * the Region to retrieve Shipping Options from.
   */
  regionId?: string;
};

