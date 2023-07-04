/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface GetOrderEditsParams {
  /**
   * Query used for searching order edit internal note.
   */
  q?: string
  /**
   * List order edits by order id.
   */
  order_id?: string
  /**
   * The number of items in the response
   */
  limit?: number
  /**
   * The offset of items in response
   */
  offset?: number
  /**
   * Comma separated list of relations to include in the results.
   */
  expand?: string
  /**
   * Comma separated list of fields to include in the results.
   */
  fields?: string
}
