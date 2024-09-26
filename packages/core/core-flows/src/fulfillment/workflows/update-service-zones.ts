import { FulfillmentWorkflow, ServiceZoneDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateServiceZonesStep } from "../steps/update-service-zones"

export const updateServiceZonesWorkflowId = "update-service-zones-workflow"
/**
 * This workflow updates one or more service zones.
 */
export const updateServiceZonesWorkflow = createWorkflow(
  updateServiceZonesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.UpdateServiceZonesWorkflowInput>
  ): WorkflowResponse<ServiceZoneDTO[]> => {
    return new WorkflowResponse(updateServiceZonesStep(input))
  }
)
