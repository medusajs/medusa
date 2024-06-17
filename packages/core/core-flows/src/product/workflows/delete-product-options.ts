import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteProductOptionsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteProductOptionsWorkflowId = "delete-product-options"
export const deleteProductOptionsWorkflow = createWorkflow(
  deleteProductOptionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteProductOptionsStep(input.ids)
  }
)
