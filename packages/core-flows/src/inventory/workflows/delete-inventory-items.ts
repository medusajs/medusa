import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deAttachInventoryItemStep, deleteInventoryItemStep } from "../steps"

export const deleteInventoryItemWorkflowId = "delete-inventory-item-workflow"
export const deleteInventoryItemWorkflow = createWorkflow(
  deleteInventoryItemWorkflowId,
  (input: WorkflowData<string[]>): WorkflowData<string[]> => {
    deleteInventoryItemStep(input)

    deAttachInventoryItemStep(input)
    return input
  }
)
