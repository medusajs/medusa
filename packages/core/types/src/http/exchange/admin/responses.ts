import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminOrder, AdminOrderPreview } from "../../order"
import { AdminReturn } from "../../return"
import { AdminExchange } from "./entities"

export interface AdminExchangeResponse {
  exchange: AdminExchange
}

export type AdminExchangeListResponse = PaginatedResponse<{
  exchanges: AdminExchange[]
}>

export interface AdminExchangeOrderResponse {
  order: AdminOrder
  exchange: AdminExchange
}

export interface AdminExchangePreviewResponse {
  order_preview: AdminOrderPreview
  exchange: AdminExchange
}

export interface AdminExchangeRequestResponse
  extends AdminExchangePreviewResponse {
  return: AdminReturn
}

export interface AdminExchangeReturnResponse {
  order_preview: AdminOrderPreview
  return: AdminReturn
}

export interface AdminExchangeDeleteResponse
  extends DeleteResponse<"exchange"> {}
