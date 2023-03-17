/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetRegionsParams {
  /**
   * limit the number of regions in response
   */
  limit?: number
  /**
   * Offset of regions in response (used for pagination)
   */
  offset?: number
  /**
   * Date comparison for when resulting region was created, i.e. less than, greater than etc.
   */
  created_at?: Record<string, any>
  /**
   * Date comparison for when resulting region was updated, i.e. less than, greater than etc.
   */
  updated_at?: Record<string, any>
  /**
   * Date comparison for when resulting region was deleted, i.e. less than, greater than etc.
   */
  deleted_at?: Record<string, any>
}
