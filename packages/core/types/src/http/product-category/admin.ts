import { PaginatedResponse } from "../common"
import { ProductCategoryResponse } from "./common"

export interface AdminProductCategoryResponse {
  product_category: ProductCategoryResponse
}

export type AdminProductCategoryListResponse = PaginatedResponse<{
  product_categories: ProductCategoryResponse[]
}>
