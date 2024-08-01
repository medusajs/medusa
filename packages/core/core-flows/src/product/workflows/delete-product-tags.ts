import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteProductTagsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteProductTagsWorkflowId = "delete-product-tags"
export const deleteProductTagsWorkflow = createWorkflow(
  deleteProductTagsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const deletedProductTags = deleteProductTagsStep(input.ids)
    const productTagsDeleted = createHook("productTagsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedProductTags, {
      hooks: [productTagsDeleted],
    })
  }
)
