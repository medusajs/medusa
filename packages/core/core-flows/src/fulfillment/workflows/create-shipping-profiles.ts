import { FulfillmentWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createShippingProfilesStep } from "../steps"

export const createShippingProfilesWorkflowId =
  "create-shipping-profiles-workflow"
export const createShippingProfilesWorkflow = createWorkflow(
  createShippingProfilesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateShippingProfilesWorkflowInput>
  ): WorkflowResponse<
    WorkflowData<FulfillmentWorkflow.CreateShippingProfilesWorkflowOutput>
  > => {
    return new WorkflowResponse(createShippingProfilesStep(input.data))
  }
)
