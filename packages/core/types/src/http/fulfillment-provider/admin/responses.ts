import { PaginatedResponse } from "../../common"
import { AdminFulfillmentProvider } from "./entities"

export interface AdminFulfillmentProviderListResponse
  extends PaginatedResponse<{
    fulfillment_providers: AdminFulfillmentProvider[]
  }> {}
