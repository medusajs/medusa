import { PaginatedResponse } from "../../common"
import { StoreProduct } from "../store"

export interface StoreProductResponse {
  product: StoreProduct
}

export type StoreProductListResponse = PaginatedResponse<{
  products: StoreProduct[]
}>
