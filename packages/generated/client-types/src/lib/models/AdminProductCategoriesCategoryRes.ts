/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductCategory } from "./ProductCategory"

export interface AdminProductCategoriesCategoryRes {
  product_category: SetRelation<
    ProductCategory,
    "category_children" | "parent_category"
  >
}
