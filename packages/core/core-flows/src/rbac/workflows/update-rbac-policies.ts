import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { UpdateRbacPolicyDTO } from "@medusajs/types"
import { updateRbacPoliciesStep } from "../steps/update-rbac-policies"

/**
 * The data to update RBAC policies.
 */
export type UpdateRbacPoliciesWorkflowInput = {
  /**
   * The filters to select the policies to update.
   */
  selector: Record<string, any>
  /**
   * The data to update in the selected policies.
   */
  update: Omit<UpdateRbacPolicyDTO, "id">
}

/**
 * @featureFlag rbac
 */
export const updateRbacPoliciesWorkflowId = "update-rbac-policies"

/**
 * This workflow updates one or more RBAC policies matching the specified filters.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to update RBAC policies within your custom flows.
 *
 * @example
 * const { result } = await updateRbacPoliciesWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "pol_123"
 *     },
 *     update: {
 *       operation: "write"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update one or more RBAC policies.
 *
 * @featureFlag rbac
 */
export const updateRbacPoliciesWorkflow = createWorkflow(
  updateRbacPoliciesWorkflowId,
  (input: WorkflowData<UpdateRbacPoliciesWorkflowInput>) => {
    return new WorkflowResponse(updateRbacPoliciesStep(input))
  }
)
