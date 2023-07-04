/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostPriceListsPriceListReq {
  /**
   * The name of the Price List
   */
  name: string
  /**
   * A description of the Price List.
   */
  description: string
  /**
   * The date with timezone that the Price List starts being valid.
   */
  starts_at?: string
  /**
   * The date with timezone that the Price List ends being valid.
   */
  ends_at?: string
  /**
   * The type of the Price List.
   */
  type: "sale" | "override"
  /**
   * The status of the Price List.
   */
  status?: "active" | "draft"
  /**
   * The prices of the Price List.
   */
  prices: Array<{
    /**
     * The ID of the Region for which the price is used. Only required if currecny_code is not provided.
     */
    region_id?: string
    /**
     * The 3 character ISO currency code for which the price will be used. Only required if region_id is not provided.
     */
    currency_code?: string
    /**
     * The amount to charge for the Product Variant.
     */
    amount: number
    /**
     * The ID of the Variant for which the price is used.
     */
    variant_id: string
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
   * A list of customer groups that the Price List applies to.
   */
  customer_groups?: Array<{
    /**
     * The ID of a customer group
     */
    id: string
  }>
  /**
   * [EXPERIMENTAL] Tax included in prices of price list
   */
  includes_tax?: boolean
}
