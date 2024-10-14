import { PaginatedResponse } from "../../common"
import { StorePaymentCollection, StorePaymentProvider } from "./entities"

export interface StorePaymentCollectionResponse {
  payment_collection: StorePaymentCollection
}

export type StorePaymentProviderListResponse = PaginatedResponse<{
  payment_providers: StorePaymentProvider[]
}>
