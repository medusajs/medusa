import { AdditionalData, ProductTypes } from "@medusajs/framework/types"
import { ProductOptionWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createProductOptionsStep } from "../steps"

export type CreateProductOptionsWorkflowInput = {
  product_options: ProductTypes.CreateProductOptionDTO[]
} & AdditionalData

export const createProductOptionsWorkflowId = "create-product-options"
/**
 * This workflow creates one or more product options.
 */
export const createProductOptionsWorkflow = createWorkflow(
  createProductOptionsWorkflowId,
  (input: WorkflowData<CreateProductOptionsWorkflowInput>) => {
    const productOptions = createProductOptionsStep(input.product_options)
    const productOptionsCreated = createHook("productOptionsCreated", {
      product_options: productOptions,
      additional_data: input.additional_data,
    })

    const optionIdEvents = transform(
      { productOptions },
      ({ productOptions }) => {
        return productOptions.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductOptionWorkflowEvents.CREATED,
      data: optionIdEvents,
    })

    return new WorkflowResponse(productOptions, {
      hooks: [productOptionsCreated],
    })
  }
)
