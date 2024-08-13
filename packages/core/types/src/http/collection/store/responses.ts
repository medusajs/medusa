import { StoreCollection } from "."
import { PaginatedResponse } from "../../common"

export interface StoreCollectionResponse {
  collection: StoreCollection
}

export type StoreCollectionListResponse = PaginatedResponse<{
  collections: StoreCollection[]
}>
