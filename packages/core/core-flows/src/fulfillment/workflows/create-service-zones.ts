import { FulfillmentWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createServiceZonesStep } from "../steps"

export const createServiceZonesWorkflowId = "create-service-zones-workflow"
export const createServiceZonesWorkflow = createWorkflow(
  createServiceZonesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateServiceZonesWorkflowInput>
  ): WorkflowResponse<WorkflowData> => {
    return new WorkflowResponse(createServiceZonesStep(input.data))
  }
)
