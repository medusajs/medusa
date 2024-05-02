/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

/**
 * The details of the products to associat with the tax rate.
 */
export interface AdminPostTaxRatesTaxRateProductsReq {
  /**
   * The IDs of the products to associate with this tax rate
   */
  products: Array<string>;
};


