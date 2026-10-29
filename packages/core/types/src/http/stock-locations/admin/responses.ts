import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminStockLocation } from "./entities"

export interface AdminStockLocationResponse {
  /**
   * The stock location's details.
   */
  stock_location: AdminStockLocation
}

export interface AdminStockLocationListResponse extends PaginatedResponse<{
  /**
   * The list of stock locations.
   */
  stock_locations: AdminStockLocation[]
}> {}

export interface AdminStockLocationDeleteResponse extends DeleteResponse<"stock_location"> {}
