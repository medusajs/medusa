import { AdminProduct } from "../../product"
import { BaseProductCategory } from "../common"

export interface AdminProductCategory
  extends Omit<
    BaseProductCategory,
    "products" | "category_children" | "parent_category"
  > {
  category_children: AdminProductCategory[]
  parent_category: AdminProductCategory | null
  products?: AdminProduct[]
}
