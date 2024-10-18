import { PaginatedResponse } from "../../common"
import { StorePaymentCollection, StorePaymentProvider } from "./entities"

export interface StorePaymentCollectionResponse {
  /**
   * The payment collection's details.
   */
  payment_collection: StorePaymentCollection
}

export type StorePaymentProviderListResponse = PaginatedResponse<{
  /**
   * The paginated list of providers.
   */
  payment_providers: StorePaymentProvider[]
}>
