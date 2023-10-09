/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetProductsParams {
  /**
   * term to search products' title, description, variants' title and sku, and collections' title.
   */
  q?: string
  /**
   * Filter by the ID of a discount condition. Only products that this discount condition is applied to will be retrieved.
   */
  discount_condition_id?: string
  /**
   * Filter by product IDs.
   */
  id?: string | Array<string>
  /**
   * Filter by status.
   */
  status?: Array<"draft" | "proposed" | "published" | "rejected">
  /**
   * Filter by product collection IDs. Only products that are associated with the specified collections will be retrieved.
   */
  collection_id?: Array<string>
  /**
   * Filter by product tag IDs. Only products that are associated with the specified tags will be retrieved.
   */
  tags?: Array<string>
  /**
   * Filter by IDs of price lists. Only products that these price lists are applied to will be retrieved.
   */
  price_list_id?: Array<string>
  /**
   * Filter by sales channel IDs. Only products that are available in the specified sales channels will be retrieved.
   */
  sales_channel_id?: Array<string>
  /**
   * Filter by product type IDs. Only products that are associated with the specified types will be retrieved.
   */
  type_id?: Array<string>
  /**
   * Filter by product category IDs. Only products that are associated with the specified categories will be retrieved.
   */
  category_id?: Array<string>
  /**
   * whether to include product category children when filtering by `category_id`
   */
  include_category_children?: boolean
  /**
   * Filter by title.
   */
  title?: string
  /**
   * Filter by description.
   */
  description?: string
  /**
   * Filter by handle.
   */
  handle?: string
  /**
   * Whether to retrieve gift cards or regular products.
   */
  is_giftcard?: boolean
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
  /**
   * A product field to sort-order the retrieved products by.
   */
  order?: string
}
