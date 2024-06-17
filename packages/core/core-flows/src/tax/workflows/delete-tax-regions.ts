import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteTaxRegionsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteTaxRegionsWorkflowId = "delete-tax-regions"
export const deleteTaxRegionsWorkflow = createWorkflow(
  deleteTaxRegionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteTaxRegionsStep(input.ids)
  }
)
