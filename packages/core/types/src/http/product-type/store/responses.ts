import { PaginatedResponse } from "../../common"
import { StoreProductType } from "./entities"

export interface StoreProductTypeResponse {
  /**
   * The type's details.
   */
  product_type: StoreProductType
}

export interface StoreProductTypeListResponse extends PaginatedResponse<{
  /**
   * The paginated list of types.
   */
  product_types: StoreProductType[]
}> {}
