import { AdditionalData, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createProductTypesStep } from "../steps"

export type CreateProductTypesWorkflowInput = {
  product_types: ProductTypes.CreateProductTypeDTO[]
} & AdditionalData

export const createProductTypesWorkflowId = "create-product-types"
/**
 * This workflow creates one or more product types.
 */
export const createProductTypesWorkflow = createWorkflow(
  createProductTypesWorkflowId,
  (input: WorkflowData<CreateProductTypesWorkflowInput>) => {
    const productTypes = createProductTypesStep(input.product_types)
    const productTypesCreated = createHook("productTypesCreated", {
      product_types: productTypes,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(productTypes, {
      hooks: [productTypesCreated],
    })
  }
)
