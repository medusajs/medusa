/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetInventoryItemsItemLocationLevelsParams {
  /**
   * How many stock locations levels to skip in the result.
   */
  offset?: number
  /**
   * Limit the number of stock locations levels returned.
   */
  limit?: number
  /**
   * Comma separated list of relations to include in the results.
   */
  expand?: string
  /**
   * Comma separated list of fields to include in the results.
   */
  fields?: string
}
