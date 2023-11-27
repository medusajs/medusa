/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { StockLocationExpandedDTO } from "./StockLocationExpandedDTO"

/**
 * The stock location's details.
 */
export interface AdminStockLocationsRes {
  /**
   * Stock location details.
   */
  stock_location: StockLocationExpandedDTO
}
