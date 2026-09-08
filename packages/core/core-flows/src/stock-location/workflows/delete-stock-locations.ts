import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"

import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteStockLocationsStep } from "../steps"

/**
 * The data to delete stock locations.
 */
export interface DeleteStockLocationWorkflowInput {
  /**
   * The IDs of the stock locations to delete.
   */
  ids: string[]
}

export const deleteStockLocationsWorkflowId = "delete-stock-locations-workflow"
/**
 * This workflow deletes one or more stock locations. It's used by the
 * [Delete Stock Location Admin API Route](https://docs.medusajs.com/api/admin/stock-locations/delete-a-stock-location).
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to delete stock locations in your custom flows.
 * 
 * @example
 * const { result } = await deleteStockLocationsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["sloc_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete one or more stock locations.
 */
export const deleteStockLocationsWorkflow = createWorkflow(
  deleteStockLocationsWorkflowId,
  (input: WorkflowData<DeleteStockLocationWorkflowInput>) => {
    const softDeletedEntities = deleteStockLocationsStep(input.ids)
    removeRemoteLinkStep(softDeletedEntities)
  }
)
