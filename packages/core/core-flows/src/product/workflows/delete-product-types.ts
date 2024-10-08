import { ProductTypeWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { deleteProductTypesStep } from "../steps"

export type DeleteProductTypesWorkflowInput = { ids: string[] }

export const deleteProductTypesWorkflowId = "delete-product-types"
/**
 * This workflow deletes one or more product types.
 */
export const deleteProductTypesWorkflow = createWorkflow(
  deleteProductTypesWorkflowId,
  (input: WorkflowData<DeleteProductTypesWorkflowInput>) => {
    const deletedProductTypes = deleteProductTypesStep(input.ids)
    const productTypesDeleted = createHook("productTypesDeleted", {
      ids: input.ids,
    })

    const typeIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: ProductTypeWorkflowEvents.DELETED,
      data: typeIdEvents,
    })

    return new WorkflowResponse(deletedProductTypes, {
      hooks: [productTypesDeleted],
    })
  }
)
