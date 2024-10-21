import { StoreCollection } from "."
import { PaginatedResponse } from "../../common"

export interface StoreCollectionResponse {
  /**
   * The collection's details.
   */
  collection: StoreCollection
}

export type StoreCollectionListResponse = PaginatedResponse<{
  /**
   * The paginated list of collections.
   */
  collections: StoreCollection[]
}>
