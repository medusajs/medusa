import { InventoryLevelDTO, InventoryNext } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import {
  createInventoryLevelsStep,
  deleteInventoryLevelsFromItemAndLocationsStep,
} from "../steps"

import { removeRemoteLinkStep } from "../../common"

interface WorkflowInput {
  creates: InventoryNext.CreateInventoryLevelInput[]
  deletes: { inventory_item_id: string; location_id: string }[]
}

export const bulkCreateDeleteLevelsWorkflowId =
  "bulk-create-delete-levels-workflow"
export const bulkCreateDeleteLevelsWorkflow = createWorkflow(
  bulkCreateDeleteLevelsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<InventoryLevelDTO[]> => {
    const deleted = deleteInventoryLevelsFromItemAndLocationsStep(input.deletes)

    removeRemoteLinkStep(deleted)

    return createInventoryLevelsStep(input.creates)
  }
)
