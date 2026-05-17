import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateComboItemStep } from "../steps/update-combo-item"

export const updateComboItemWorkflow = createWorkflow(
  "update-combo-item",
  (input: WorkflowData<{ id: string; [key: string]: unknown }>) => {
    const comboItem = updateComboItemStep(input)
    return new WorkflowResponse(comboItem)
  }
)
