import { SetRelation } from "../core/ModelUtils";
import type { ProductCategory } from "./ProductCategory";
/**
 * The product category's details.
 */
export interface AdminProductCategoriesCategoryRes {
    /**
     * Product category details.
     */
    product_category: SetRelation<ProductCategory, "category_children" | "parent_category">;
}
