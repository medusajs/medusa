import type {
  InventoryLevelDTO,
  InventoryTypes,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { InventoryLevelWorkflowEvents } from "@medusajs/framework/utils"

import { emitEventStep } from "../../common"
import { updateInventoryLevelsStep } from "../steps/update-inventory-levels"

/**
 * The data to update the inventory levels.
 */
export interface UpdateInventoryLevelsWorkflowInput {
  /**
   * The inventory levels to update.
   */
  updates: InventoryTypes.UpdateInventoryLevelInput[]
}

/**
 * The updated inventory levels.
 */
export type UpdateInventoryLevelsWorkflowOutput = InventoryLevelDTO[]

export const updateInventoryLevelsWorkflowId =
  "update-inventory-levels-workflow"
/**
 * This workflow updates one or more inventory levels. It's used by the
 * [Update Inventory Level Admin API Route](https://docs.medusajs.com/api/admin/inventory-items/update-inventory-level).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to update inventory levels in your custom flows.
 *
 * @example
 * const { result } = await updateInventoryLevelsWorkflow(container)
 * .run({
 *   input: {
 *     updates: [
 *       {
 *         id: "iilev_123",
 *         inventory_item_id: "iitem_123",
 *         location_id: "sloc_123",
 *         stocked_quantity: 10,
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Update one or more inventory levels.
 */
export const updateInventoryLevelsWorkflow = createWorkflow(
  updateInventoryLevelsWorkflowId,
  (
    input: WorkflowData<UpdateInventoryLevelsWorkflowInput>
  ): WorkflowResponse<UpdateInventoryLevelsWorkflowOutput> => {
    const inventoryLevels = updateInventoryLevelsStep(input.updates)

    const levelIdEvents = transform(
      { inventoryLevels },
      ({ inventoryLevels }) => {
        return inventoryLevels.map((level) => ({ id: level.id }))
      }
    )

    emitEventStep({
      eventName: InventoryLevelWorkflowEvents.UPDATED,
      data: levelIdEvents,
    })

    return new WorkflowResponse(inventoryLevels)
  }
)
