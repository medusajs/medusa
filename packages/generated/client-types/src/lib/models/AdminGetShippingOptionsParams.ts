/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetShippingOptionsParams {
  /**
   * Filter by name.
   */
  name?: string
  /**
   * Filter by the ID of the region the shipping options belong to.
   */
  region_id?: string
  /**
   * Filter by whether the shipping options are return shipping options.
   */
  is_return?: boolean
  /**
   * Filter by whether the shipping options are available for admin users only.
   */
  admin_only?: boolean
  /**
   * Term used to search shipping options' name.
   */
  q?: string
  /**
   * A shipping option field to sort-order the retrieved shipping options by.
   */
  order?: string
  /**
   * Filter by shipping option IDs.
   */
  id?: string | Array<string>
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
   * The number of users to skip when retrieving the shipping options.
   */
  offset?: number
  /**
   * Limit the number of shipping options returned.
   */
  limit?: number
  /**
   * Comma-separated relations that should be expanded in the returned shipping options.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned shipping options.
   */
  fields?: string
}
