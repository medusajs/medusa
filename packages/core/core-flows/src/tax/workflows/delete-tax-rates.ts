import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteTaxRatesStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteTaxRatesWorkflowId = "delete-tax-rates"
export const deleteTaxRatesWorkflow = createWorkflow(
  deleteTaxRatesWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<void>> => {
    return new WorkflowResponse(deleteTaxRatesStep(input.ids))
  }
)
