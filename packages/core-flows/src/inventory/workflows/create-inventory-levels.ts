import { InventoryLevelDTO, InventoryNext } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import {
  createInventoryLevelsStep,
  validateInventoryLocationsStep,
} from "../steps"

interface WorkflowInput {
  inventory_levels: InventoryNext.CreateInventoryLevelInput[]
}
export const createInventoryLevelsWorkflowId =
  "create-inventory-levels-workflow"
export const createInventoryLevelsWorkflow = createWorkflow(
  createInventoryLevelsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<InventoryLevelDTO[]> => {
    validateInventoryLocationsStep(input.inventory_levels)

    return createInventoryLevelsStep(input.inventory_levels)
  }
)
