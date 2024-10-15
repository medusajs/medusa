import { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateShippingProfilesStep } from "../steps/update-shipping-profiles"

export const updateShippingProfilesWorkflowId =
  "update-shipping-profiles-workflow"
/**
 * This workflow updates one or more shipping profiles.
 */
export const updateShippingProfilesWorkflow = createWorkflow(
  updateShippingProfilesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.UpdateShippingProfilesWorkflowInput>
  ): WorkflowResponse<FulfillmentWorkflow.CreateShippingProfilesWorkflowOutput> => {
    return new WorkflowResponse(updateShippingProfilesStep(input))
  }
)
