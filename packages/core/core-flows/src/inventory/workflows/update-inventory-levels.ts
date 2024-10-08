import { InventoryLevelDTO, InventoryTypes } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"

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
