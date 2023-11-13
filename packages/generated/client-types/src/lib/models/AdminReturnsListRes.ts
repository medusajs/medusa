/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Return } from "./Return"

/**
 * The list of returns with pagination fields.
 */
export interface AdminReturnsListRes {
  /**
   * An array of returns details.
   */
  returns: Array<Return>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of returns skipped when retrieving the returns.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
