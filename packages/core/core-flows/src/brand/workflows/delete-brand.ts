import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteBrandStep } from "../steps/delete-brand"

export const deleteBrandWorkflow = createWorkflow(
  "delete-brand",
  (input: WorkflowData<{ id: string }>) => {
    deleteBrandStep(input)
    return new WorkflowResponse(void 0)
  }
)
