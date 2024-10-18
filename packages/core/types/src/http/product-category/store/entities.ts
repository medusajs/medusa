import { StoreProduct } from "../../product/store"
import { BaseProductCategory } from "../common"

export interface StoreProductCategory
  extends Omit<
    BaseProductCategory,
    | "is_active"
    | "is_internal"
    | "products"
    | "parent_category"
    | "category_children"
  > {
  /**
   * The category's products.
   */
  products?: StoreProduct[]
  /**
   * The parent category.
   */
  parent_category: StoreProductCategory | null
  /**
   * The category's children.
   */
  category_children: StoreProductCategory[]
}
