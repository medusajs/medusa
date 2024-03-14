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

import { CreateInventoryItemInput } from "@medusajs/types"

interface WorkflowInput {
  items: (CreateInventoryItemInput & { _associationTag?: string })[]
}

export const createInventoryItemsWorkflowId = "create-inventory-items-workflow"
export const createInventoryItemsWorkflow = createWorkflow(
  createInventoryItemsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    validateInventoryItemsForCreate(input.items)

    const items = createInventoryItemsStep(input.items)

    attachInventoryItemToVariants(items)

    return transform(items, (items) => {
      return items.map(({ inventoryItem }) => inventoryItem)
    })
  }
)
