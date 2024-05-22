import { FulfillmentWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createShippingProfilesStep } from "../steps"

export const createShippingProfilesWorkflowId =
  "create-shipping-profiles-workflow"
export const createShippingProfilesWorkflow = createWorkflow(
  createShippingProfilesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateShippingProfilesWorkflowInput>
  ): WorkflowData<FulfillmentWorkflow.CreateShippingProfilesWorkflowOutput> => {
    const shippingProfiles = createShippingProfilesStep(input.data)

    return shippingProfiles
  }
)
