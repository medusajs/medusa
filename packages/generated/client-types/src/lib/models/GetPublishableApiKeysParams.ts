/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface GetPublishableApiKeysParams {
  /**
   * term to search publishable API keys' titles.
   */
  q?: string
  /**
   * Limit the number of publishable API keys returned.
   */
  limit?: number
  /**
   * The number of publishable API keys to skip when retrieving the publishable API keys.
   */
  offset?: number
  /**
   * Comma-separated relations that should be expanded in the returned publishable API keys.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned publishable API keys.
   */
  fields?: string
  /**
   * A field to sort-order the retrieved publishable API keys by.
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
   * Filter by a update date range.
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
   * Filter by a revocation date range.
   */
  revoked_at?: {
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
