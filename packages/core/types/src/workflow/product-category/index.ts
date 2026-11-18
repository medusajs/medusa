import { LinkWorkflowInput } from "../../common"
import { AdditionalData } from "../../http"
import {
  CreateProductCategoryDTO,
  FilterableProductCategoryProps,
  UpdateProductCategoryDTO,
} from "../../product"

/**
 * The data to create product categories.
 */
export type CreateProductCategoriesWorkflowInput = {
  /**
   * The product categories to create.
   */
  product_categories: CreateProductCategoryDTO[]
} & AdditionalData
/**
 * The data to update product categories.
 */
export type UpdateProductCategoriesWorkflowInput = {
  /**
   * The filters to select the product categories to update.
   */
  selector: FilterableProductCategoryProps
  /**
   * The data to update in the product categories.
   */
  update: UpdateProductCategoryDTO
} & AdditionalData

/**
 * The products to manage of a category.
 */
export interface BatchUpdateProductsOnCategoryWorkflowInput extends LinkWorkflowInput {}
