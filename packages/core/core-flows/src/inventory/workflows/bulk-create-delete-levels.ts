import { InventoryLevelDTO, InventoryTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import {
  createInventoryLevelsStep,
  deleteInventoryLevelsFromItemAndLocationsStep,
} from "../steps"

export interface BulkCreateDeleteLevelsWorkflowInput {
  creates: InventoryTypes.CreateInventoryLevelInput[]
  deletes: { inventory_item_id: string; location_id: string }[]
}

export const bulkCreateDeleteLevelsWorkflowId =
  "bulk-create-delete-levels-workflow"
/**
 * This workflow creates and deletes inventory levels.
 */
export const bulkCreateDeleteLevelsWorkflow = createWorkflow(
  bulkCreateDeleteLevelsWorkflowId,
  (
    input: WorkflowData<BulkCreateDeleteLevelsWorkflowInput>
  ): WorkflowResponse<InventoryLevelDTO[]> => {
    deleteInventoryLevelsFromItemAndLocationsStep(input.deletes)

    return new WorkflowResponse(createInventoryLevelsStep(input.creates))
  }
)
