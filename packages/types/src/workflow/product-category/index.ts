import { LinkWorkflowInput } from "../../common"
import {
  CreateProductCategoryDTO,
  UpdateProductCategoryDTO,
} from "../../product"

export interface CreateProductCategoryWorkflowInput {
  product_category: CreateProductCategoryDTO
}

// TODO: Should we converted to bulk update
export interface UpdateProductCategoryWorkflowInput {
  // selector: FilterableProductCategoryProps
  // data: UpdateProductCategoryDTO
  id: string
  data: UpdateProductCategoryDTO
}

export interface BatchUpdateProductsOnCategoryWorkflowInput
  extends LinkWorkflowInput {}
