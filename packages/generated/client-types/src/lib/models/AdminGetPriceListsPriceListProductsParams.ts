/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetPriceListsPriceListProductsParams {
  /**
   * Query used for searching product title and description, variant title and sku, and collection title.
   */
  q?: string
  /**
   * ID of the product to search for.
   */
  id?: string
  /**
   * Product status to search for
   */
  status?: Array<"draft" | "proposed" | "published" | "rejected">
  /**
   * Collection IDs to search for
   */
  collection_id?: Array<string>
  /**
   * Tag IDs to search for
   */
  tags?: Array<string>
  /**
   * product title to search for.
   */
  title?: string
  /**
   * product description to search for.
   */
  description?: string
  /**
   * product handle to search for.
   */
  handle?: string
  /**
   * Search for giftcards using is_giftcard=true.
   */
  is_giftcard?: string
  /**
   * to search for.
   */
  type?: string
  /**
   * field to sort results by.
   */
  order?: string
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
}
