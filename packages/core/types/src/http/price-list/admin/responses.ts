import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminPrice } from "../../pricing"
import { AdminPriceList } from "./entities"

export interface AdminPriceListResponse {
  /**
   * The price list's details.
   */
  price_list: AdminPriceList
}

export interface AdminPriceListListResponse
  extends PaginatedResponse<{
    /**
     * The list of price lists.
     */
    price_lists: AdminPriceList[]
  }> {}

export interface AdminPriceListDeleteResponse
  extends DeleteResponse<"price_list"> {}

export interface AdminPriceListBatchResponse {
  /**
   * The created prices.
   */
  created: AdminPrice[]
  /**
   * The updated prices.
   */
  updated: AdminPrice[]
  /**
   * Details about the deleted prices.
   */
  deleted: {
    ids: string[]
    object: "price"
    deleted: boolean
  }
}

export interface AdminPriceListPriceListResponse
  extends PaginatedResponse<{
    prices: AdminPrice[]
  }> {}
