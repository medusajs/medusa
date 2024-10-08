import { ProductOptionWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { deleteProductOptionsStep } from "../steps"

export type DeleteProductOptionsWorkflowInput = { ids: string[] }

export const deleteProductOptionsWorkflowId = "delete-product-options"
/**
 * This workflow deletes one or more product options.
 */
export const deleteProductOptionsWorkflow = createWorkflow(
  deleteProductOptionsWorkflowId,
  (input: WorkflowData<DeleteProductOptionsWorkflowInput>) => {
    const deletedProductOptions = deleteProductOptionsStep(input.ids)
    const productOptionsDeleted = createHook("productOptionsDeleted", {
      ids: input.ids,
    })

    const optionIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: ProductOptionWorkflowEvents.DELETED,
      data: optionIdEvents,
    })

    return new WorkflowResponse(deletedProductOptions, {
      hooks: [productOptionsDeleted],
    })
  }
)
