import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

import { deleteInventoryItemStep, validateInventoryDeleteStep } from "../steps"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { useQueryGraphStep } from "../../common"

export const deleteInventoryItemWorkflowId = "delete-inventory-item-workflow"
/**
 * This workflow deletes one or more inventory items.
 */
export const deleteInventoryItemWorkflow = createWorkflow(
  deleteInventoryItemWorkflowId,
  (input: WorkflowData<string[]>): WorkflowResponse<string[]> => {
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
    return new WorkflowResponse(input)
  }
)
