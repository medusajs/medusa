import { StoreProduct } from "../../product/store"
import { ProductCategory } from "../common"

export interface StoreProductCategory extends ProductCategory {
  products?: StoreProduct[]
}
