import { PaginatedResponse } from "../../common"

/**
 * @experimental
 */
interface SalesChannelResponse {
  id: string
  name: string
  description: string | null
  is_disabled: boolean
  metadata: Record<string, unknown> | null
}

/**
 * @experimental
 */
export interface AdminSalesChannelListResponse extends PaginatedResponse {
  sales_channels: SalesChannelResponse[]
}

/**
 * @experimental
 */
export interface AdminSalesChannelResponse {
  sales_channel: SalesChannelResponse
}
