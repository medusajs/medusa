import { StoreProduct } from "../../product/store"
import { BaseProductCategory } from "../common"

export interface StoreProductCategory extends 
  Omit<BaseProductCategory, "is_active" | "is_internal" | "products" | "parent_category" | "category_children"> {
    products?: StoreProduct[]
    parent_category: StoreProductCategory | null
    category_children: StoreProductCategory[]
}
