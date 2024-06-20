import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminProductType } from "./entities"

export interface AdminProductTypeResponse {
  product_type: AdminProductType
}

export interface AdminProductTypeListResponse
  extends PaginatedResponse<{
    product_types: AdminProductType[]
  }> {}

export interface AdminProductTypeDeleteResponse
  extends DeleteResponse<"product_type"> {}
