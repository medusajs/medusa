import type {
  FulfillmentWorkflow,
  ServiceZoneDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createServiceZonesStep } from "../steps"

/**
 * The service zones to create.
 */
export type CreateServiceZonesWorkflowOutput = ServiceZoneDTO[]

export const createServiceZonesWorkflowId = "create-service-zones-workflow"
/**
 * This workflow creates one or more service zones. It's used by the
 * [Add Service Zone to Fulfillment Set Admin API Route](https://docs.medusajs.com/api/admin/fulfillment-sets/add-service-zone).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * create service zones within your custom flows.
 *
 * @example
 * const { result } = await createServiceZonesWorkflow(container)
 * .run({
 *   input: {
 *     data: [
 *       {
 *         name: "US",
 *         fulfillment_set_id: "fuset_123",
 *         geo_zones: [
 *           {
 *             type: "country",
 *             country_code: "us",
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more service zones.
 */
export const createServiceZonesWorkflow = createWorkflow(
  createServiceZonesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateServiceZonesWorkflowInput>
  ): WorkflowResponse<CreateServiceZonesWorkflowOutput> => {
    return new WorkflowResponse(createServiceZonesStep(input.data))
  }
)
