import { StoreProduct } from "../../product/store"
import { BaseProductCategory } from "../common"

export interface StoreProductCategory extends BaseProductCategory {
  products?: StoreProduct[]
}
