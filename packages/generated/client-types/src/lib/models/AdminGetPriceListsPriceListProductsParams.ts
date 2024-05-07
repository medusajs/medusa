/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetPriceListsPriceListProductsParams {
  /**
   * term used to search products' title, description, product variant's title and sku, and product collection's title.
   */
  q?: string
  /**
   * Filter by product IDs.
   */
  id?: string | Array<string>
  /**
   * Filter by product status
   */
  status?: Array<"draft" | "proposed" | "published" | "rejected">
  /**
   * Filter by product collection ID. Only products in the specified collections are retrieved.
   */
  collection_id?: Array<string>
  /**
   * Filter by tag IDs. Only products having the specified tags are retrieved.
   */
  tags?: Array<string>
  /**
   * Filter by title
   */
  title?: string
  /**
   * Filter by description
   */
  description?: string
  /**
   * Filter by handle
   */
  handle?: string
  /**
   * A boolean value to filter by whether the product is a gift card or not.
   */
  is_giftcard?: boolean
  /**
   * Filter product type.
   */
  type?: string
  /**
   * A product field to sort-order the retrieved products by.
   */
  order?: string
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
  /**
   * Filter by a deletion date range.
   */
  deleted_at?: {
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
   * The number of products to skip when retrieving the products.
   */
  offset?: number
  /**
   * Limit the number of products returned.
   */
  limit?: number
  /**
   * Comma-separated relations that should be expanded in the returned products.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned products.
   */
  fields?: string
}
