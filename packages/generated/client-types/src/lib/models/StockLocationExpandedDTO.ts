/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { SalesChannel } from "./SalesChannel"
import type { StockLocationDTO } from "./StockLocationDTO"

export type StockLocationExpandedDTO = StockLocationDTO & {
  /**
   * The associated sales channels.
   */
  sales_channels?: SalesChannel
}
