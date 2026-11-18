import { PaginatedResponse } from "../../common"
import {
  AdminFulfillmentProvider,
  AdminFulfillmentProviderOption,
} from "./entities"

export interface AdminFulfillmentProviderListResponse extends PaginatedResponse<{
  /**
   * The list of fulfillment providers.
   */
  fulfillment_providers: AdminFulfillmentProvider[]
}> {}

export interface AdminFulfillmentProviderOptionsListResponse extends PaginatedResponse<{
  /**
   * The list of fulfillment options.
   */
  fulfillment_options: AdminFulfillmentProviderOption[]
}> {}
