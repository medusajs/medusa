import { PaginatedResponse } from "../../common"
import { AdminStore } from "./entities"

export interface AdminStoreResponse {
  /**
   * The store's details.
   */
  store: AdminStore
}

export interface AdminStoreListResponse extends PaginatedResponse<{
  /**
   * The list of stores.
   */
  stores: AdminStore[]
}> {}
