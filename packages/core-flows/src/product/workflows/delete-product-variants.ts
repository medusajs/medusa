import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteProductVariantsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteProductVariantsWorkflowId = "delete-product-variants"
export const deleteProductVariantsWorkflow = createWorkflow(
  deleteProductVariantsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteProductVariantsStep(input.ids)
  }
)
