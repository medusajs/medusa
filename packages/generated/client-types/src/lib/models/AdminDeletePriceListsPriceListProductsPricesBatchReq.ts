/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminDeletePriceListsPriceListProductsPricesBatchReq {
  /**
   * The IDs of the products to delete their associated prices.
   */
  product_ids?: Array<string>
}
