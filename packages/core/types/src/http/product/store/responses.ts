import { PaginatedResponse } from "../../common"
import { StoreProduct } from "../store"

export interface StoreProductResponse {
  /**
   * The product's details.
   */
  product: StoreProduct
}

export type StoreProductListResponse = PaginatedResponse<{
  /**
   * The list of products.
   */
  products: StoreProduct[]
}>
