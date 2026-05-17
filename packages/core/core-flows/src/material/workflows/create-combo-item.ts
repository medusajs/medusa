import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createComboItemStep } from "../steps/create-combo-item"

export const createComboItemWorkflow = createWorkflow(
  "create-combo-item",
  (
    input: WorkflowData<{
      parent_material_id: string
      child_material_id: string
      [key: string]: unknown
    }>
  ) => {
    const comboItem = createComboItemStep(input)
    return new WorkflowResponse(comboItem)
  }
)
