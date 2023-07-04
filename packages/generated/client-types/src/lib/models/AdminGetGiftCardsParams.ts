/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetGiftCardsParams {
  /**
   * The number of items to skip before the results.
   */
  offset?: number
  /**
   * Limit the number of items returned.
   */
  limit?: number
  /**
   * a search term to search by code or display ID
   */
  q?: string
}
