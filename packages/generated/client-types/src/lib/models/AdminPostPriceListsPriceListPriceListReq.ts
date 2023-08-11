/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostPriceListsPriceListPriceListReq {
  /**
   * The name of the Price List
   */
  name?: string
  /**
   * The description of the Price List.
   */
  description?: string
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
  type?: "sale" | "override"
  /**
   * The status of the Price List. If the status is set to `draft`, the prices created in the price list will not be available of the customer.
   */
  status?: "active" | "draft"
  /**
   * The prices of the Price List.
   */
  prices?: Array<{
    /**
     * The ID of the price.
     */
    id?: string
    /**
     * The ID of the Region for which the price is used. This is only required if `currecny_code` is not provided.
     */
    region_id?: string
    /**
     * The 3 character ISO currency code for which the price will be used. This is only required if `region_id` is not provided.
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
   * An array of customer groups that the Price List applies to.
   */
  customer_groups?: Array<{
    /**
     * The ID of a customer group
     */
    id: string
  }>
  /**
   * Tax included in prices of price list
   */
  includes_tax?: boolean
}
