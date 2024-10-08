import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminProductCategory } from "./entities"

export interface AdminProductCategoryResponse {
  product_category: AdminProductCategory
}

export interface AdminProductCategoryListResponse
  extends PaginatedResponse<{
    product_categories: AdminProductCategory[]
  }> {}

export interface AdminProductCategoryDeleteResponse
  extends DeleteResponse<"product_category"> {}
