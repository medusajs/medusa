import { BaseFilterable } from "../../../dal"
import { OrderStatus } from "../../../order"
import { FindParams, SelectParams } from "../../common"

export interface StoreOrderFilters
  extends FindParams,
    BaseFilterable<StoreOrderFilters> {
  /**
   * Filter by order ID(s).
   */
  id?: string | string[]
  /**
   * Filter by order status(es).
   */
  status?: OrderStatus | OrderStatus[]
}

export interface StoreGetOrderParams extends SelectParams {}
