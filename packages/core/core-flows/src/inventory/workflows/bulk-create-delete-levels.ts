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

interface WorkflowInput {
  creates: InventoryTypes.CreateInventoryLevelInput[]
  deletes: { inventory_item_id: string; location_id: string }[]
}

export const bulkCreateDeleteLevelsWorkflowId =
  "bulk-create-delete-levels-workflow"
export const bulkCreateDeleteLevelsWorkflow = createWorkflow(
  bulkCreateDeleteLevelsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<InventoryLevelDTO[]>> => {
    deleteInventoryLevelsFromItemAndLocationsStep(input.deletes)

    return new WorkflowResponse(createInventoryLevelsStep(input.creates))
  }
)
