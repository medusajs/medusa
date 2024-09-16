import { InventoryLevelDTO, InventoryTypes } from "@medusajs/types"
import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import { createInventoryLevelsStep } from "../steps"
import { deleteInventoryLevelsWorkflow } from "./delete-inventory-levels"

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
    deleteInventoryLevelsWorkflow.runAsStep({
      input: {
        $or: input.deletes,
      },
    })

    return new WorkflowResponse(createInventoryLevelsStep(input.creates))
  }
)
