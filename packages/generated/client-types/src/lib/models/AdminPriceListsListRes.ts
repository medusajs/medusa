/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PriceList } from "./PriceList"

export interface AdminPriceListsListRes {
  /**
   * An array of price lists details.
   */
  price_lists: Array<PriceList>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of price lists skipped when retrieving the price lists.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
