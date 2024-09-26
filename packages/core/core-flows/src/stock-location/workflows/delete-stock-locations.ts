import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"

import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteStockLocationsStep } from "../steps"

export interface DeleteStockLocationWorkflowInput {
  ids: string[]
}

export const deleteStockLocationsWorkflowId = "delete-stock-locations-workflow"
/**
 * This workflow deletes one or more stock locations.
 */
export const deleteStockLocationsWorkflow = createWorkflow(
  deleteStockLocationsWorkflowId,
  (input: WorkflowData<DeleteStockLocationWorkflowInput>) => {
    const softDeletedEntities = deleteStockLocationsStep(input.ids)
    removeRemoteLinkStep(softDeletedEntities)
  }
)
