import { PaginatedResponse } from "../../common"
import { ProductCategoryResponse } from "./common"

/**
 * @experimental
 */
export interface StoreProductCategoryResponse {
  product_category: ProductCategoryResponse
}

/**
 * @experimental
 */
export interface StoreProductCategoryListResponse extends PaginatedResponse {
  product_categories: ProductCategoryResponse[]
}
