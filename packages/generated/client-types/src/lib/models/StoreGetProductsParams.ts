/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetProductsParams {
  /**
   * term used to search products' title, description, variant's title, variant's sku, and collection's title.
   */
  q?: string
  /**
   * Filter by IDs.
   */
  id?: string | Array<string>
  /**
   * Filter by sales channel IDs. When provided, only products available in the selected sales channels are retrieved. Alternatively, you can pass a publishable API key in the request header and this will have the same effect.
   */
  sales_channel_id?: Array<string>
  /**
   * Filter by product collection IDs. When provided, only products that belong to the specified product collections are retrieved.
   */
  collection_id?: Array<string>
  /**
   * Filter by product type IDs. When provided, only products that belong to the specified product types are retrieved.
   */
  type_id?: Array<string>
  /**
   * Filter by product tag IDs. When provided, only products that belong to the specified product tags are retrieved.
   */
  tags?: Array<string>
  /**
   * Filter by title.
   */
  title?: string
  /**
   * Filter by description
   */
  description?: string
  /**
   * Filter by handle.
   */
  handle?: string
  /**
   * Whether to retrieve regular products or gift-card products.
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
   * Filter by product category IDs. When provided, only products that belong to the specified product categories are retrieved.
   */
  category_id?: Array<string>
  /**
   * Whether to include child product categories when filtering using the `category_id` field.
   */
  include_category_children?: boolean
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
