import { AdminProduct } from "../../product"
import { AdminTranslation } from "../../translations"
import { BaseProductCategory } from "../common"

export interface AdminProductCategory
  extends Omit<
    BaseProductCategory,
    "products" | "category_children" | "parent_category"
  > {
  /**
   * The category's children.
   */
  category_children: AdminProductCategory[]
  /**
   * The parent category's details.
   */
  parent_category: AdminProductCategory | null
  /**
   * The products that belong to this category.
   */
  products?: AdminProduct[]
  /**
   * The category's translations.
   */
  translations?: AdminTranslation[] | null
}
