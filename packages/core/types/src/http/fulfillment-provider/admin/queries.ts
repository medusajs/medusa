import { FindParams } from "../../common"

export interface AdminFulfillmentProviderListParams extends FindParams {
  /**
   * Filter by provider ID(s).
   */
  id?: string | string[]
  /**
   * Query or keywords to filter the provider's searchable fields.
   */
  q?: string
  /**
   * Filter by whether the provider is enabled.
   */
  is_enabled?: boolean
  /**
   * Filter by stock location ID(s) to retrieve their associated
   * fulfillment providers.
   */
  stock_location_id?: string | string[]
}
