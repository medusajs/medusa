import { PaginatedResponse } from "../../common"
import { StoreOrder } from "./entities"

export interface StoreOrderResponse {
  order: StoreOrder
}

export type StoreOrderListResponse = PaginatedResponse<{ orders: StoreOrder[] }>
