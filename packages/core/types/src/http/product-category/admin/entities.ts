import { AdminProduct } from "../../product"
import { ProductCategory } from "../common"

export interface AdminProductCategory extends ProductCategory {
  category_children: AdminProductCategory[]
  parent_category: AdminProductCategory | null
  products?: AdminProduct[]
}
