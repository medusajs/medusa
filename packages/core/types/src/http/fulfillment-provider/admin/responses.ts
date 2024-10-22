import { PaginatedResponse } from "../../common"
import { AdminFulfillmentProvider } from "./entities"

export interface AdminFulfillmentProviderListResponse
  extends PaginatedResponse<{
    /**
     * The list of fulfillment providers.
     */
    fulfillment_providers: AdminFulfillmentProvider[]
  }> {}
