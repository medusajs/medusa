import { OrderDTO } from "../../../order"
import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminOrderPreview } from "../../order"
import { AdminReturn } from "../../return"
import { AdminExchange } from "./entities"

export interface AdminExchangeResponse {
  /**
   * The exchange's details.
   */
  exchange: AdminExchange
}

export type AdminExchangeListResponse = PaginatedResponse<{
  /**
   * This list of exchanges.
   */
  exchanges: AdminExchange[]
}>

export interface AdminExchangeOrderResponse {
  order: OrderDTO
  exchange: AdminExchange
}

export interface AdminExchangePreviewResponse {
  /**
   * The preview of the order when the exchange is applied.
   */
  order_preview: AdminOrderPreview
  /**
   * The exchange's details.
   */
  exchange: AdminExchange
}

export interface AdminExchangeRequestResponse
  extends AdminExchangePreviewResponse {
  /**
   * The return associated with the exchange.
   */
  return: AdminReturn
}

export interface AdminExchangeReturnResponse {
  /**
   * A preview of the order when the exchange is confirmed.
   */
  order_preview: AdminOrderPreview
  /**
   * The return associated with the exchange.
   */
  return: AdminReturn
}

export interface AdminExchangeDeleteResponse
  extends DeleteResponse<"exchange"> {}
