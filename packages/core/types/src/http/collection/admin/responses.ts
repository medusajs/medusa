import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminCollection } from "./entities"

export interface AdminCollectionResponse {
  /**
   * The collection's details.
   */
  collection: AdminCollection
}

export interface AdminCollectionListResponse extends PaginatedResponse<{
  /**
   * The list of collections.
   */
  collections: AdminCollection[]
}> {}

export interface AdminCollectionDeleteResponse extends DeleteResponse<"collection"> {}
