/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PriceList } from "./PriceList"

/**
 * The price list's details.
 */
export interface AdminPriceListRes {
  /**
   * Price List details.
   */
  price_list: SetRelation<PriceList, "customer_groups" | "prices">
}
