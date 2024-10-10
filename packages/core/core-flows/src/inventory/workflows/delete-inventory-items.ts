import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

import { deleteInventoryItemStep, validateInventoryDeleteStep } from "../steps"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { useRemoteQueryStep } from "../../common"

export const deleteInventoryItemWorkflowId = "delete-inventory-item-workflow"
/**
 * This workflow deletes one or more inventory items.
 */
export const deleteInventoryItemWorkflow = createWorkflow(
  deleteInventoryItemWorkflowId,
  (input: WorkflowData<string[]>): WorkflowResponse<string[]> => {
    const inventoryItemsToDelete = useRemoteQueryStep({
      entry_point: "inventory",
      fields: ["id", "reserved_quantity"],
      variables: {
        id: input,
      },
      list: true,
    })

    validateInventoryDeleteStep({ inventory_items: inventoryItemsToDelete })

    deleteInventoryItemStep(input)
    removeRemoteLinkStep({
      [Modules.INVENTORY]: { inventory_item_id: input },
    })
    return new WorkflowResponse(input)
  }
)
