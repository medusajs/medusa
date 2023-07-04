/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetVariantsParams {
  /**
   * A comma separated list of Product Variant ids to filter by.
   */
  ids?: string
  /**
   * A sales channel id for result configuration.
   */
  sales_channel_id?: string
  /**
   * A comma separated list of Product Variant relations to load.
   */
  expand?: string
  /**
   * How many product variants to skip in the result.
   */
  offset?: number
  /**
   * Maximum number of Product Variants to return.
   */
  limit?: number
  /**
   * The id of the Cart to set prices based on.
   */
  cart_id?: string
  /**
   * The id of the Region to set prices based on.
   */
  region_id?: string
  /**
   * The currency code to use for price selection.
   */
  currency_code?: string
  /**
   * product variant title to search for.
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
