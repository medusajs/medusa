import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminSalesChannel } from "./entities"

export interface AdminSalesChannelResponse {
  /**
   * The sales channel's details.
   */
  sales_channel: AdminSalesChannel
}

export type AdminSalesChannelListResponse = PaginatedResponse<{
  /**
   * The list of sales channels.
   */
  sales_channels: AdminSalesChannel[]
}>

export interface AdminSalesChannelDeleteResponse extends DeleteResponse<"sales-channel"> {}
