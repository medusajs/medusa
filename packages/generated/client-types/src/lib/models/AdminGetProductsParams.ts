/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetProductsParams {
  /**
   * Query used for searching product title and description, variant title and sku, and collection title.
   */
  q?: string
  /**
   * The discount condition id on which to filter the product.
   */
  discount_condition_id?: string
  /**
   * Filter by product IDs.
   */
  id?: string | Array<string>
  /**
   * Status to search for
   */
  status?: Array<"draft" | "proposed" | "published" | "rejected">
  /**
   * Collection ids to search for.
   */
  collection_id?: Array<string>
  /**
   * Tag IDs to search for
   */
  tags?: Array<string>
  /**
   * Price List IDs to search for
   */
  price_list_id?: Array<string>
  /**
   * Sales Channel IDs to filter products by
   */
  sales_channel_id?: Array<string>
  /**
   * Type IDs to filter products by
   */
  type_id?: Array<string>
  /**
   * Category IDs to filter products by
   */
  category_id?: Array<string>
  /**
   * Include category children when filtering by category_id
   */
  include_category_children?: boolean
  /**
   * title to search for.
   */
  title?: string
  /**
   * description to search for.
   */
  description?: string
  /**
   * handle to search for.
   */
  handle?: string
  /**
   * Search for giftcards using is_giftcard=true.
   */
  is_giftcard?: boolean
  /**
   * Date comparison for when resulting products were created.
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
   * Date comparison for when resulting products were updated.
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
   * Date comparison for when resulting products were deleted.
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
   * How many products to skip in the result.
   */
  offset?: number
  /**
   * Limit the number of products returned.
   */
  limit?: number
  /**
   * (Comma separated) Which fields should be expanded in each product of the result.
   */
  expand?: string
  /**
   * (Comma separated) Which fields should be included in each product of the result.
   */
  fields?: string
  /**
   * the field used to order the products.
   */
  order?: string
}
