import { AdditionalData, ProductTypes } from "@medusajs/framework/types"
import { ProductTypeWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
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

    const typeIdEvents = transform({ productTypes }, ({ productTypes }) => {
      return productTypes.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: ProductTypeWorkflowEvents.CREATED,
      data: typeIdEvents,
    })

    return new WorkflowResponse(productTypes, {
      hooks: [productTypesCreated],
    })
  }
)
