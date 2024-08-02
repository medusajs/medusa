import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteProductOptionsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteProductOptionsWorkflowId = "delete-product-options"
export const deleteProductOptionsWorkflow = createWorkflow(
  deleteProductOptionsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const deletedProductOptions = deleteProductOptionsStep(input.ids)
    const productOptionsDeleted = createHook("productOptionsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedProductOptions, {
      hooks: [productOptionsDeleted],
    })
  }
)
