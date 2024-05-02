/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetUsersParams {
  /**
   * Filter by email.
   */
  email?: string
  /**
   * Filter by first name.
   */
  first_name?: string
  /**
   * Filter by last name.
   */
  last_name?: string
  /**
   * Term used to search users' first name, last name, and email.
   */
  q?: string
  /**
   * A user field to sort-order the retrieved users by.
   */
  order?: string
  /**
   * Filter by user IDs.
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
   * The number of users to skip when retrieving the users.
   */
  offset?: number
  /**
   * Limit the number of users returned.
   */
  limit?: number
  /**
   * Comma-separated fields that should be included in the returned users.
   */
  fields?: string
}
