import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminCollection } from "./entities"

export interface AdminCollectionResponse {
  collection: AdminCollection
}

export interface AdminCollectionListResponse
  extends PaginatedResponse<{
    collections: AdminCollection[]
  }> {}

export interface AdminCollectionDeleteResponse
  extends DeleteResponse<"collection"> {}
