import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { Modules } from "@medusajs/modules-sdk"
import { deleteStockLocationsStep } from "../steps"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"

interface WorkflowInput {
  ids: string[]
}

export const deleteStockLocationsWorkflowId = "delete-stock-locations-workflow"
export const deleteStockLocationsWorkflow = createWorkflow(
  deleteStockLocationsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    deleteStockLocationsStep(input.ids)

    removeRemoteLinkStep({
      [Modules.STOCK_LOCATION]: { stock_location_id: input.ids },
    })
  }
)
