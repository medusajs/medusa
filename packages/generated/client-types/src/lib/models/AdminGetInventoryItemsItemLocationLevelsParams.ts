/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetInventoryItemsItemLocationLevelsParams {
  /**
   * Filter by location IDs.
   */
  location_id?: Array<string>
  /**
   * Comma-separated relations that should be expanded in the returned inventory levels.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned inventory levels.
   */
  fields?: string
}
