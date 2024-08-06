import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteStockLocationsStep } from "../steps"

interface WorkflowInput {
  ids: string[]
}

export const deleteStockLocationsWorkflowId = "delete-stock-locations-workflow"
export const deleteStockLocationsWorkflow = createWorkflow(
  deleteStockLocationsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const softDeletedEntities = deleteStockLocationsStep(input.ids)
    removeRemoteLinkStep(softDeletedEntities)
  }
)
