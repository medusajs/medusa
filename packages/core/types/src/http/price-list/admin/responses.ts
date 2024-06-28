import { DeleteResponse, PaginatedResponse } from "../../common"
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
