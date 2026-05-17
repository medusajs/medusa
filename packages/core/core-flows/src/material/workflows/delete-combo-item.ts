import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteComboItemStep } from "../steps/delete-combo-item"

export const deleteComboItemWorkflow = createWorkflow(
  "delete-combo-item",
  (input: WorkflowData<{ id: string }>) => {
    deleteComboItemStep(input)
    return new WorkflowResponse(void 0)
  }
)
