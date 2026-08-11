import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteServiceZonesStep } from "../steps"

/**
 * The data to delete one or more service zones.
 */
export type DeleteServiceZonesWorkflowInput = {
  /**
   * The IDs of the service zones to delete.
   */
  ids: string[]
}

export const deleteServiceZonesWorkflowId = "delete-service-zones-workflow"
/**
 * This workflow deletes one or more service zones. It's used by the
 * [Remove Service Zones from Fulfillment Set Admin API Route](https://docs.medusajs.com/api/admin/fulfillment-sets/remove-service-zone).
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * delete service zones within your custom flows.
 * 
 * @example
 * const { result } = await deleteServiceZonesWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["serzo_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete one or more service zones.
 */
export const deleteServiceZonesWorkflow = createWorkflow(
  deleteServiceZonesWorkflowId,
  (input: WorkflowData<DeleteServiceZonesWorkflowInput>) => {
    deleteServiceZonesStep(input.ids)
  }
)
