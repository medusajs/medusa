import { PaginatedResponse } from "../common"
import { ProductCategoryResponse } from "./common"

export interface StoreProductCategoryResponse {
  product_category: ProductCategoryResponse
}

export type StoreProductCategoryListResponse = PaginatedResponse<{
  product_categories: ProductCategoryResponse[]
}>
