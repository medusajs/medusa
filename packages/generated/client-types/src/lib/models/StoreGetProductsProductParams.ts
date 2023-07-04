/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetProductsProductParams {
  /**
   * The sales channel used when fetching the product.
   */
  sales_channel_id?: string
  /**
   * The ID of the customer's cart.
   */
  cart_id?: string
  /**
   * The ID of the region the customer is using. This is helpful to ensure correct prices are retrieved for a region.
   */
  region_id?: string
  /**
   * (Comma separated) Which fields should be included in the result.
   */
  fields?: string
  /**
   * (Comma separated) Which fields should be expanded in each product of the result.
   */
  expand?: string
  /**
   * The 3 character ISO currency code to set prices based on. This is helpful to ensure correct prices are retrieved for a currency.
   */
  currency_code?: string
}
