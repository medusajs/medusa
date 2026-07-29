import type { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createShippingProfilesStep } from "../steps"

export const createShippingProfilesWorkflowId =
  "create-shipping-profiles-workflow"
/**
 * This workflow creates one or more shipping profiles. It's used by the
 * [Create Shipping Profile Admin API Route](https://docs.medusajs.com/api/admin/shipping-profiles/create-shipping-profile).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * create shipping profiles within your custom flows.
 *
 * @example
 * const { result } = await createShippingProfilesWorkflow(container)
 * .run({
 *   input: {
 *     data: [
 *       {
 *         name: "Standard",
 *         type: "standard"
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more shipping profiles.
 */
export const createShippingProfilesWorkflow = createWorkflow(
  createShippingProfilesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateShippingProfilesWorkflowInput>
  ): WorkflowResponse<FulfillmentWorkflow.CreateShippingProfilesWorkflowOutput> => {
    return new WorkflowResponse(createShippingProfilesStep(input.data))
  }
)
