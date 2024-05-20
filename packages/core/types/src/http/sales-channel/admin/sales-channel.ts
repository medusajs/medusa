import { PaginatedResponse } from "../../common"

interface SalesChannelResponse {
  id: string
  name: string
  description: string | null
  is_disabled: boolean
  metadata: Record<string, unknown> | null
}

export type AdminSalesChannelListResponse = PaginatedResponse<{
  sales_channels: SalesChannelResponse[]
}>

export interface AdminSalesChannelResponse {
  sales_channel: SalesChannelResponse
}
