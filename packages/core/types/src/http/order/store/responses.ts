import { PaginatedResponse } from "../../common"
import { StoreOrder } from "./entities"

export interface StoreOrderResponse {
  /**
   * The order's details.
   */
  order: StoreOrder
}

export type StoreOrderListResponse = PaginatedResponse<{ 
  /**
   * The list of orders.
   */
  orders: StoreOrder[]
}>
