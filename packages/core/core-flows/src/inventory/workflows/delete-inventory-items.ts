import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { Modules } from "@medusajs/modules-sdk"
import { deleteInventoryItemStep } from "../steps"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"

export const deleteInventoryItemWorkflowId = "delete-inventory-item-workflow"
export const deleteInventoryItemWorkflow = createWorkflow(
  deleteInventoryItemWorkflowId,
  (input: WorkflowData<string[]>): WorkflowData<string[]> => {
    deleteInventoryItemStep(input)

    removeRemoteLinkStep({
      [Modules.INVENTORY]: { inventory_item_id: input },
    })
    return input
  }
)
