import { InventoryLevelDTO, InventoryTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"

import { updateInventoryLevelsStep } from "../steps/update-inventory-levels"

export interface UpdateInventoryLevelsWorkflowInput {
  updates: InventoryTypes.BulkUpdateInventoryLevelInput[]
}
export const updateInventoryLevelsWorkflowId =
  "update-inventory-levels-workflow"
/**
 * This workflow updates one or more inventory levels.
 */
export const updateInventoryLevelsWorkflow = createWorkflow(
  updateInventoryLevelsWorkflowId,
  (
    input: WorkflowData<UpdateInventoryLevelsWorkflowInput>
  ): WorkflowResponse<InventoryLevelDTO[]> => {
    return new WorkflowResponse(updateInventoryLevelsStep(input.updates))
  }
)
