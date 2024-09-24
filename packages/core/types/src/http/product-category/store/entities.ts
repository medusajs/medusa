import { StoreProduct } from "../../product/store"
import { BaseProductCategory } from "../common"

export interface StoreProductCategory extends 
  Omit<BaseProductCategory, "is_active" | "is_internal" | "products"> {
    products?: StoreProduct[]
}
