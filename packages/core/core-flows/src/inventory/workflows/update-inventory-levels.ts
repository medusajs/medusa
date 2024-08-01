import { InventoryLevelDTO, InventoryTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"

import { updateInventoryLevelsStep } from "../steps/update-inventory-levels"

interface WorkflowInput {
  updates: InventoryTypes.BulkUpdateInventoryLevelInput[]
}
export const updateInventoryLevelsWorkflowId =
  "update-inventory-levels-workflow"
export const updateInventoryLevelsWorkflow = createWorkflow(
  updateInventoryLevelsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<InventoryLevelDTO[]> => {
    return new WorkflowResponse(updateInventoryLevelsStep(input.updates))
  }
)
