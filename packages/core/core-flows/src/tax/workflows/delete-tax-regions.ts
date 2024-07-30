import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteTaxRegionsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteTaxRegionsWorkflowId = "delete-tax-regions"
export const deleteTaxRegionsWorkflow = createWorkflow(
  deleteTaxRegionsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<void>> => {
    return new WorkflowResponse(deleteTaxRegionsStep(input.ids))
  }
)
