import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  attachInventoryItemToVariants,
  createInventoryItemsStep,
  validateInventoryItemsForCreate,
} from "../steps"

import { InventoryNext } from "@medusajs/types"

interface WorkflowInput {
  items: InventoryNext.CreateInventoryItemInput[]
}

export const createInventoryItemsWorkflowId = "create-inventory-items-workflow"
export const createInventoryItemsWorkflow = createWorkflow(
  createInventoryItemsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const items = createInventoryItemsStep(input.items)

    return items
  }
)
