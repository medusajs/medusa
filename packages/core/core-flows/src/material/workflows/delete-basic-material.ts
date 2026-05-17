import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteBasicMaterialStep } from "../steps/delete-basic-material"

export const deleteBasicMaterialWorkflow = createWorkflow(
  "delete-basic-material",
  (input: WorkflowData<{ id: string }>) => {
    deleteBasicMaterialStep(input)
    return new WorkflowResponse(void 0)
  }
)
