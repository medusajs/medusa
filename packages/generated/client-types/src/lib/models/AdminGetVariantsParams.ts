/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetVariantsParams {
  /**
   * Filter by product variant IDs.
   */
  id?: string | Array<string>
  /**
   * "Comma-separated relations that should be expanded in the returned product variants."
   */
  expand?: string
  /**
   * "Comma-separated fields that should be included in the returned product variants."
   */
  fields?: string
  /**
   * The number of product variants to skip when retrieving the product variants.
   */
  offset?: number
  /**
   * Limit the number of product variants returned.
   */
  limit?: number
  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  order?: string
  /**
   * Filter product variants by whether their inventory is managed or not.
   */
  manage_inventory?: boolean
  /**
   * Filter product variants by whether they are allowed to be backordered or not.
   */
  allow_backorder?: boolean
  /**
   * The ID of the cart to use for the price selection context.
   */
  cart_id?: string
  /**
   * The ID of the region to use for the price selection context.
   */
  region_id?: string
  /**
   * The 3 character ISO currency code to use for the price selection context.
   */
  currency_code?: string
  /**
   * The ID of the customer to use for the price selection context.
   */
  customer_id?: string
  /**
   * Filter by title.
   */
  title?: string | Array<string>
  /**
   * Filter by available inventory quantity
   */
  inventory_quantity?:
    | number
    | {
        /**
         * filter by inventory quantity less than this number
         */
        lt?: number
        /**
         * filter by inventory quantity greater than this number
         */
        gt?: number
        /**
         * filter by inventory quantity less than or equal to this number
         */
        lte?: number
        /**
         * filter by inventory quantity greater than or equal to this number
         */
        gte?: number
      }
}
