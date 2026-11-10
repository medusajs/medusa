import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminProductType } from "./entities"

export interface AdminProductTypeResponse {
  /**
   * The product type's details.
   */
  product_type: AdminProductType
}

export interface AdminProductTypeListResponse extends PaginatedResponse<{
  /**
   * The list of product types.
   */
  product_types: AdminProductType[]
}> {}

export interface AdminProductTypeDeleteResponse extends DeleteResponse<"product_type"> {}
