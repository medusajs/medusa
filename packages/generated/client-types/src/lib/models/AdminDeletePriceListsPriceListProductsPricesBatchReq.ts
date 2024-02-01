/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the products' prices to delete.
 */
export interface AdminDeletePriceListsPriceListProductsPricesBatchReq {
  /**
   * The IDs of the products to delete their associated prices.
   */
  product_ids?: Array<string>
}
