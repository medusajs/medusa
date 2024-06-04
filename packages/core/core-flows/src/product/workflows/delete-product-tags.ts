import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteProductTagsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteProductTagsWorkflowId = "delete-product-tags"
export const deleteProductTagsWorkflow = createWorkflow(
  deleteProductTagsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteProductTagsStep(input.ids)
  }
)
