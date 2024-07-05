import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteProductTypesStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteProductTypesWorkflowId = "delete-product-types"
export const deleteProductTypesWorkflow = createWorkflow(
  deleteProductTypesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteProductTypesStep(input.ids)
  }
)
