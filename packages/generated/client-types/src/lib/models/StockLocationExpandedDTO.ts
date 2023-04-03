/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { SalesChannel } from "./SalesChannel"
import type { StockLocationDTO } from "./StockLocationDTO"

export type StockLocationExpandedDTO = StockLocationDTO & {
  sales_channels?: SalesChannel
}
