import { ProductTagWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { deleteProductTagsStep } from "../steps"

export type DeleteProductTagsWorkflowInput = { ids: string[] }

export const deleteProductTagsWorkflowId = "delete-product-tags"
/**
 * This workflow deletes one or more product tags.
 */
export const deleteProductTagsWorkflow = createWorkflow(
  deleteProductTagsWorkflowId,
  (input: WorkflowData<DeleteProductTagsWorkflowInput>) => {
    const deletedProductTags = deleteProductTagsStep(input.ids)
    const productTagsDeleted = createHook("productTagsDeleted", {
      ids: input.ids,
    })

    const tagIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: ProductTagWorkflowEvents.DELETED,
      data: tagIdEvents,
    })

    return new WorkflowResponse(deletedProductTags, {
      hooks: [productTagsDeleted],
    })
  }
)
