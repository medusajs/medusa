import { FulfillmentWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateServiceZonesStep } from "../steps/update-service-zones"

export const updateServiceZonesWorkflowId = "update-service-zones-workflow"
export const updateServiceZonesWorkflow = createWorkflow(
  updateServiceZonesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.UpdateServiceZonesWorkflowInput>
  ): WorkflowData => {
    const serviceZones = updateServiceZonesStep(input)

    return serviceZones
  }
)
