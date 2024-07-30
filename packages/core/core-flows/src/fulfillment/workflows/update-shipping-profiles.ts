import { FulfillmentWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateShippingProfilesStep } from "../steps/update-shipping-profiles"

export const updateShippingProfilesWorkflowId =
  "update-shipping-profiles-workflow"
export const updateShippingProfilesWorkflow = createWorkflow(
  updateShippingProfilesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.UpdateShippingProfilesWorkflowInput>
  ): WorkflowResponse<
    WorkflowData<FulfillmentWorkflow.CreateShippingProfilesWorkflowOutput>
  > => {
    return new WorkflowResponse(updateShippingProfilesStep(input))
  }
)
