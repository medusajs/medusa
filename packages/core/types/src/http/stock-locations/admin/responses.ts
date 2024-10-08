import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminStockLocation } from "./entities"

export interface AdminStockLocationResponse {
  stock_location: AdminStockLocation
}

export interface AdminStockLocationListResponse
  extends PaginatedResponse<{
    stock_locations: AdminStockLocation[]
  }> {}

export interface AdminStockLocationDeleteResponse
  extends DeleteResponse<"stock_location"> {}
