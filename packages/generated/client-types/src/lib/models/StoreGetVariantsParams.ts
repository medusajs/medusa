/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetVariantsParams {
  /**
   * Filter by a comma-separated list of IDs. If supplied, it overrides the `id` parameter.
   */
  ids?: string
  /**
   * Filter by one or more IDs. If `ids` is supplied, it's overrides the value of this parameter.
   */
  id?: string | Array<string>
  /**
   * "Filter by sales channel IDs. When provided, only products available in the selected sales channels are retrieved. Alternatively, you can pass a publishable API key in the request header and this will have the same effect."
   */
  sales_channel_id?: string
  /**
   * Comma-separated relations that should be expanded in the returned product variants.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned product variants.
   */
  fields?: string
  /**
   * The number of products to skip when retrieving the product variants.
   */
  offset?: number
  /**
   * Limit the number of product variants returned.
   */
  limit?: number
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
  /**
   * Filter by title
   */
  title?: string | Array<string>
  /**
   * Filter by available inventory quantity
   */
  inventory_quantity?:
    | number
    | {
        /**
         * Filter by inventory quantity less than this number
         */
        lt?: number
        /**
         * Filter by inventory quantity greater than this number
         */
        gt?: number
        /**
         * Filter by inventory quantity less than or equal to this number
         */
        lte?: number
        /**
         * Filter by inventory quantity greater than or equal to this number
         */
        gte?: number
      }
}
