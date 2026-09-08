import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { InventoryItemWorkflowEvents, Modules } from "@medusajs/framework/utils"

import { deleteInventoryItemStep, validateInventoryDeleteStep } from "../steps"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { emitEventStep, useQueryGraphStep } from "../../common"

/**
 * The IDs of the inventory items to delete.
 */
export type DeleteInventoryItemWorkflowInput = string[]

/**
 * The IDs of deleted inventory items.
 */
export type DeleteInventoryItemWorkflowOutput = string[]

export const deleteInventoryItemWorkflowId = "delete-inventory-item-workflow"
/**
 * This workflow deletes one or more inventory items. It's used by the
 * [Delete Inventory Item Admin API Route](https://docs.medusajs.com/api/admin/inventory-items/delete-inventory-item).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to delete inventory items in your custom flows.
 *
 * @example
 * const { result } = await deleteInventoryItemWorkflow(container)
 * .run({
 *   input: ["iitem_123"]
 * })
 *
 * @summary
 *
 * Delete one or more inventory items.
 */
export const deleteInventoryItemWorkflow = createWorkflow(
  deleteInventoryItemWorkflowId,
  (
    input: WorkflowData<DeleteInventoryItemWorkflowInput>
  ): WorkflowResponse<DeleteInventoryItemWorkflowOutput> => {
    const { data: inventoryItemsToDelete } = useQueryGraphStep({
      entity: "inventory",
      fields: ["id", "reserved_quantity"],
      filters: {
        id: input,
      },
    })

    validateInventoryDeleteStep({ inventory_items: inventoryItemsToDelete })

    deleteInventoryItemStep(input)
    removeRemoteLinkStep({
      [Modules.INVENTORY]: { inventory_item_id: input },
    })

    const itemIdEvents = transform({ input }, ({ input }) => {
      return input.map((id) => ({ id }))
    })

    emitEventStep({
      eventName: InventoryItemWorkflowEvents.DELETED,
      data: itemIdEvents,
    })

    return new WorkflowResponse(input)
  }
)
