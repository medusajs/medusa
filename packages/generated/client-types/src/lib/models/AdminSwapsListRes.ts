/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Swap } from "./Swap"

/**
 * The list of swaps with pagination fields.
 */
export interface AdminSwapsListRes {
  /**
   * An array of swaps details.
   */
  swaps: Array<Swap>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of swaps skipped when retrieving the swaps.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
