import { AdditionalData, ProductTypes } from "@medusajs/framework/types"
import { ProductTagWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createProductTagsStep } from "../steps"

export type CreateProductTagsWorkflowInput = {
  product_tags: ProductTypes.CreateProductTagDTO[]
} & AdditionalData

export const createProductTagsWorkflowId = "create-product-tags"
/**
 * This workflow creates one or more product tags.
 */
export const createProductTagsWorkflow = createWorkflow(
  createProductTagsWorkflowId,
  (input: WorkflowData<CreateProductTagsWorkflowInput>) => {
    const productTags = createProductTagsStep(input.product_tags)
    const productTagsCreated = createHook("productTagsCreated", {
      product_tags: productTags,
      additional_data: input.additional_data,
    })

    const tagIdEvents = transform({ productTags }, ({ productTags }) => {
      return productTags.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: ProductTagWorkflowEvents.CREATED,
      data: tagIdEvents,
    })

    return new WorkflowResponse(productTags, {
      hooks: [productTagsCreated],
    })
  }
)
