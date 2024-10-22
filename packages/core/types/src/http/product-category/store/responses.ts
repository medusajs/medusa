import { PaginatedResponse } from "../../common"
import { StoreProductCategory } from "./entities"

export interface StoreProductCategoryResponse {
  /**
   * The category's details.
   */
  product_category: StoreProductCategory
}

export interface StoreProductCategoryListResponse
  extends PaginatedResponse<{
    /**
     * The paginated list of categories.
     */
    product_categories: StoreProductCategory[]
  }> {}
