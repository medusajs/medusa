import { PaginatedResponse } from "../../common"
import { StoreProductCategory } from "./entities"

export interface StoreProductCategoryResponse {
  product_category: StoreProductCategory
}

export interface StoreProductCategoryListResponse
  extends PaginatedResponse<{
    product_categories: StoreProductCategory[]
  }> {}
