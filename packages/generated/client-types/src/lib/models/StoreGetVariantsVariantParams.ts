/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetVariantsVariantParams {
  /**
   * The ID of the sales channel the customer is viewing the product variant from.
   */
  sales_channel_id?: string
  /**
   * The ID of the cart. This is useful for accurate pricing based on the cart's context.
   */
  cart_id?: string
  /**
   * The ID of the region. This is useful for accurate pricing based on the selected region.
   */
  region_id?: string
  /**
   * A 3 character ISO currency code. This is useful for accurate pricing based on the selected currency.
   */
  currency_code?: string
}
