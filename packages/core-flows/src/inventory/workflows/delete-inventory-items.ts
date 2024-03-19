import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deatachInventoryItemStep, deleteInventoryItemStep } from "../steps"

export const deleteInventoryItemWorkflowId = "delete-inventory-item-workflow"
export const deleteInventoryItemWorkflow = createWorkflow(
  deleteInventoryItemWorkflowId,
  (input: WorkflowData<string[]>): WorkflowData<string[]> => {
    deleteInventoryItemStep(input)

    deatachInventoryItemStep(input)
    return input
  }
)
