import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminPrice } from "../../pricing"
import { AdminPriceList } from "./entities"

export interface AdminPriceListResponse {
  price_list: AdminPriceList
}

export interface AdminPriceListListResponse
  extends PaginatedResponse<{
    price_lists: AdminPriceList[]
  }> {}

export interface AdminPriceListDeleteResponse
  extends DeleteResponse<"price_list"> {}

export interface AdminPriceListBatchResponse {
  created: AdminPrice[]
  updated: AdminPrice[]
  deleted: {
    ids: string[]
    object: "price"
    deleted: boolean
  }
}
