/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PriceList } from "./PriceList"

export interface AdminPriceListRes {
  /**
   * Price List details.
   */
  price_list: SetRelation<PriceList, "customer_groups" | "prices">
}
