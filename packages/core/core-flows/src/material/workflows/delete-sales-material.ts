import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteSalesMaterialStep } from "../steps/delete-sales-material"

export const deleteSalesMaterialWorkflow = createWorkflow(
  "delete-sales-material",
  (input: WorkflowData<{ id: string }>) => {
    deleteSalesMaterialStep(input)
    return new WorkflowResponse(void 0)
  }
)
