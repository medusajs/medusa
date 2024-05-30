import { PaginatedResponse } from "../../common"
import { ProductCategoryResponse } from "./common"

/**
 * @experimental
 */
export interface AdminProductCategoryResponse {
  product_category: ProductCategoryResponse
}

/**
 * @experimental
 */
export interface AdminProductCategoryListResponse extends PaginatedResponse {
  product_categories: ProductCategoryResponse[]
}
