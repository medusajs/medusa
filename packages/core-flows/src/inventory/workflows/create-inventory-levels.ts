import { CreateInventoryLevelInput, InventoryLevelDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { createInventoryLevelsStep } from "../steps"

interface WorkflowInput {
  inventory_levels: CreateInventoryLevelInput[]
}
export const createInventoryLevelsWorkflowId =
  "create-inventory-levels-workflow"
export const createInventoryLevelsWorkflow = createWorkflow(
  createInventoryLevelsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<InventoryLevelDTO[]> => {
    return createInventoryLevelsStep(input.inventory_levels)
  }
)
