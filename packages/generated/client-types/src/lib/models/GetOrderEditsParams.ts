/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface GetOrderEditsParams {
  /**
   * term to search order edits' internal note.
   */
  q?: string
  /**
   * Filter by order ID
   */
  order_id?: string
  /**
   * Limit the number of order edits returned.
   */
  limit?: number
  /**
   * The number of order edits to skip when retrieving the order edits.
   */
  offset?: number
  /**
   * Comma-separated relations that should be expanded in each returned order edit.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in each returned order edit.
   */
  fields?: string
}
