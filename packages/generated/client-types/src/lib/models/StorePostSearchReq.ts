/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostSearchReq {
  /**
   * The search query.
   */
  q?: string
  /**
   * The number of products to skip when retrieving the products.
   */
  offset?: number
  /**
   * Limit the number of products returned.
   */
  limit?: number
  /**
   * Pass filters based on the search service.
   */
  filter?: any
}
