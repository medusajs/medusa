import { FulfillmentWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createServiceZonesStep } from "../steps"

export const createServiceZonesWorkflowId = "create-service-zones-workflow"
export const createServiceZonesWorkflow = createWorkflow(
  createServiceZonesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateServiceZonesWorkflowInput>
  ): WorkflowData => {
    const serviceZones = createServiceZonesStep(input.data)

    return serviceZones
  }
)
