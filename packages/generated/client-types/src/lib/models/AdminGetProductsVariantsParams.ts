/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetProductsVariantsParams {
  /**
   * IDs to filter product variants by.
   */
  id?: string
  /**
   * Comma-separated fields that should be included in the returned product variants.
   */
  fields?: string
  /**
   * Comma-separated relations that should be expanded in the returned product variants.
   */
  expand?: string
  /**
   * The number of product variants to skip when retrieving the product variants.
   */
  offset?: number
  /**
   * Limit the number of product variants returned.
   */
  limit?: number
  /**
   * Search term to search product variants' title, sku, and products' title.
   */
  q?: string
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
   * Filter by a creation date range.
   */
  created_at?: {
    /**
     * filter by dates less than this date
     */
    lt?: string
    /**
     * filter by dates greater than this date
     */
    gt?: string
    /**
     * filter by dates less than or equal to this date
     */
    lte?: string
    /**
     * filter by dates greater than or equal to this date
     */
    gte?: string
  }
  /**
   * Filter by an update date range.
   */
  updated_at?: {
    /**
     * filter by dates less than this date
     */
    lt?: string
    /**
     * filter by dates greater than this date
     */
    gt?: string
    /**
     * filter by dates less than or equal to this date
     */
    lte?: string
    /**
     * filter by dates greater than or equal to this date
     */
    gte?: string
  }
}
