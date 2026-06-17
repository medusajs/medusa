import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { UpdateRbacRolePolicyDTO } from "@medusajs/types"
import { updateRbacRolePoliciesStep } from "../steps/update-rbac-role-policies"

/**
 * The data to update role-policy assignments.
 */
export type UpdateRbacRolePoliciesWorkflowInput = {
  /**
   * The filters to select the role-policy assignments to update.
   */
  selector: Record<string, any>
  /**
   * The data to update in the selected role-policy assignments.
   */
  update: Omit<UpdateRbacRolePolicyDTO, "id">
}

/**
 * @featureFlag rbac
 */
export const updateRbacRolePoliciesWorkflowId = "update-rbac-role-policies"

/**
 * This workflow updates one or more role-policy assignments matching the specified
 * filters.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to update RBAC role-policy assignments within your custom flows.
 *
 * @example
 * const { result } = await updateRbacRolePoliciesWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       role_id: "role_123"
 *     },
 *     update: {
 *       policy_id: "pol_456"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update one or more RBAC role-policy assignments.
 *
 * @featureFlag rbac
 */
export const updateRbacRolePoliciesWorkflow = createWorkflow(
  updateRbacRolePoliciesWorkflowId,
  (input: WorkflowData<UpdateRbacRolePoliciesWorkflowInput>) => {
    return new WorkflowResponse(updateRbacRolePoliciesStep(input))
  }
)
