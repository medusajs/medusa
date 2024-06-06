import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminSalesChannel } from "./entities"

export interface AdminSalesChannelResponse {
  sales_channel: AdminSalesChannel
}

export type AdminSalesChannelListResponse = PaginatedResponse<{
  sales_channels: AdminSalesChannel[]
}>

export interface AdminSalesChannelDeleteResponse
  extends DeleteResponse<"sales_channel"> {}
