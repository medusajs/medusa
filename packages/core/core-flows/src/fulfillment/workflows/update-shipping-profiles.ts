import { FulfillmentWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateShippingProfilesStep } from "../steps/update-shipping-profiles"

export const updateShippingProfilesWorkflowId =
  "update-shipping-profiles-workflow"
export const updateShippingProfilesWorkflow = createWorkflow(
  updateShippingProfilesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.UpdateShippingProfilesWorkflowInput>
  ): WorkflowData<FulfillmentWorkflow.CreateShippingProfilesWorkflowOutput> => {
    const shippingProfiles = updateShippingProfilesStep(input)

    return shippingProfiles
  }
)
