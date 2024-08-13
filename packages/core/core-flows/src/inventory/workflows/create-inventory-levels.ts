import { InventoryLevelDTO, InventoryTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import {
  createInventoryLevelsStep,
  validateInventoryLocationsStep,
} from "../steps"

export interface CreateInventoryLevelsWorkflowInput {
  inventory_levels: InventoryTypes.CreateInventoryLevelInput[]
}
export const createInventoryLevelsWorkflowId =
  "create-inventory-levels-workflow"
/**
 * This workflow creates one or more inventory levels.
 */
export const createInventoryLevelsWorkflow = createWorkflow(
  createInventoryLevelsWorkflowId,
  (
    input: WorkflowData<CreateInventoryLevelsWorkflowInput>
  ): WorkflowResponse<InventoryLevelDTO[]> => {
    validateInventoryLocationsStep(input.inventory_levels)

    return new WorkflowResponse(
      createInventoryLevelsStep(input.inventory_levels)
    )
  }
)
