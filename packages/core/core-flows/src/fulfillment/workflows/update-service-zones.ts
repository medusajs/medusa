import { FulfillmentWorkflow, ServiceZoneDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateServiceZonesStep } from "../steps/update-service-zones"

export const updateServiceZonesWorkflowId = "update-service-zones-workflow"
export const updateServiceZonesWorkflow = createWorkflow(
  updateServiceZonesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.UpdateServiceZonesWorkflowInput>
  ): WorkflowResponse<ServiceZoneDTO[]> => {
    return new WorkflowResponse(updateServiceZonesStep(input))
  }
)
