import { PaginatedResponse } from "../../common"
import { AdminStore } from "./entities"

export interface AdminStoreResponse {
  store: AdminStore
}

export interface AdminStoreListResponse
  extends PaginatedResponse<{
    stores: AdminStore[]
  }> {}
