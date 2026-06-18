// TODO: Remove this workflow in a future release.

import type {
  InventoryLevelDTO,
  InventoryTypes,
} from "@medusajs/framework/types"
import {
  createWorkflow,
  when,
  WorkflowData,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk"
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
 *
 * @deprecated Use `batchInventoryItemLevels` instead.
 */
export const bulkCreateDeleteLevelsWorkflow = createWorkflow(
  bulkCreateDeleteLevelsWorkflowId,
  (
    input: WorkflowData<BulkCreateDeleteLevelsWorkflowInput>
  ): WorkflowResponse<InventoryLevelDTO[]> => {
    when({ input }, ({ input }) => {
      return !!input.deletes?.length
    }).then(() => {
      deleteInventoryLevelsWorkflow.runAsStep({
        input: {
          $or: input.deletes,
        },
      })
    })

    const created = when({ input }, ({ input }) => {
      return !!input.creates?.length
    }).then(() => {
      return createInventoryLevelsStep(input.creates)
    })

    const createdOutput = transform({
      created,
    }, (data) => data.created || [])

    return new WorkflowResponse(createdOutput)
  }
)
