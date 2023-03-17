/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostPriceListPricesPricesReq {
  /**
   * The prices to update or add.
   */
  prices?: Array<{
    /**
     * The ID of the price.
     */
    id?: string
    /**
     * The ID of the Region for which the price is used. Only required if currecny_code is not provided.
     */
    region_id?: string
    /**
     * The 3 character ISO currency code for which the price will be used. Only required if region_id is not provided.
     */
    currency_code?: string
    /**
     * The ID of the Variant for which the price is used.
     */
    variant_id: string
    /**
     * The amount to charge for the Product Variant.
     */
    amount: number
    /**
     * The minimum quantity for which the price will be used.
     */
    min_quantity?: number
    /**
     * The maximum quantity for which the price will be used.
     */
    max_quantity?: number
  }>
  /**
   * If true the prices will replace all existing prices associated with the Price List.
   */
  override?: boolean
}
