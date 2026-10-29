import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminProductCategory } from "./entities"

export interface AdminProductCategoryResponse {
  /**
   * The category's details.
   */
  product_category: AdminProductCategory
}

export interface AdminProductCategoryListResponse extends PaginatedResponse<{
  /**
   * The list of product categories.
   */
  product_categories: AdminProductCategory[]
}> {}

export interface AdminProductCategoryDeleteResponse extends DeleteResponse<"product_category"> {}
