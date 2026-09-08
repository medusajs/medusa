import type { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateShippingProfilesStep } from "../steps/update-shipping-profiles"

/**
 * The updated shipping profiles.
 */
export type UpdateShippingProfilesWorkflowOutput =
  FulfillmentWorkflow.CreateShippingProfilesWorkflowOutput

export const updateShippingProfilesWorkflowId =
  "update-shipping-profiles-workflow"
/**
 * This workflow updates one or more shipping profiles. It's used by the
 * [Update Shipping Profiles Admin API Route](https://docs.medusajs.com/api/admin/shipping-profiles/update-a-shipping-profile).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * update shipping profiles within your custom flows.
 *
 * @example
 * const { result } = await updateShippingProfilesWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "sp_123",
 *     },
 *     update: {
 *       name: "Standard",
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update one or more shipping profiles.
 */
export const updateShippingProfilesWorkflow = createWorkflow(
  updateShippingProfilesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.UpdateShippingProfilesWorkflowInput>
  ): WorkflowResponse<UpdateShippingProfilesWorkflowOutput> => {
    return new WorkflowResponse(updateShippingProfilesStep(input))
  }
)
