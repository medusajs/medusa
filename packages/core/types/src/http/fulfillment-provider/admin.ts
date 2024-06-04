import { PaginatedResponse } from "../common"

export interface AdminFulfillmentProvider {
  id: string
  is_enabled: boolean
}

export interface AdminFulfillmentProviderListResponse
  extends PaginatedResponse<{
    fulfillment_providers: AdminFulfillmentProvider[]
  }> {}

export interface AdminFulfillmentProviderFilters {
  id?: string | string[]
  q?: string
  is_enabled?: boolean
}
