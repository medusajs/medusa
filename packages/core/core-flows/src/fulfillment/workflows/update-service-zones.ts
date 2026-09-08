import type {
  FulfillmentWorkflow,
  ServiceZoneDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateServiceZonesStep } from "../steps/update-service-zones"

/**
 * The updated service zones.
 */
export type UpdateServiceZonesWorkflowOutput = ServiceZoneDTO[]

export const updateServiceZonesWorkflowId = "update-service-zones-workflow"
/**
 * This workflow updates one or more service zones. It's used by the
 * [Update Service Zones Admin API Route](https://docs.medusajs.com/api/admin/fulfillment-sets/update-service-zone).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * update service zones within your custom flows.
 *
 * @example
 * const { result } = await updateServiceZonesWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "serzo_123"
 *     },
 *     update: {
 *       name: "Europe"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update one or more service zones.
 */
export const updateServiceZonesWorkflow = createWorkflow(
  updateServiceZonesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.UpdateServiceZonesWorkflowInput>
  ): WorkflowResponse<UpdateServiceZonesWorkflowOutput> => {
    return new WorkflowResponse(updateServiceZonesStep(input))
  }
)
