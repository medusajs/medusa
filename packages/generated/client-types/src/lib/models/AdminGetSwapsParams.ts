/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetSwapsParams {
  /**
   * Limit the number of swaps returned.
   */
  limit?: number
  /**
   * The number of swaps to skip when retrieving the swaps.
   */
  offset?: number
}
