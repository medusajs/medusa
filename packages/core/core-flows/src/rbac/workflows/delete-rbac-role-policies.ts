import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteRbacRolePoliciesStep } from "../steps"

/**
 * The data to delete role-policy assignments.
 */
export type DeleteRbacRolePoliciesWorkflowInput = {
  /**
   * The IDs of the role-policy assignments to delete.
   */
  role_policy_ids: string[]
}

/**
 * @featureFlag rbac
 */
export const deleteRbacRolePoliciesWorkflowId = "delete-rbac-role-policies"

/**
 * This workflow deletes one or more role-policy assignments, removing the associated
 * policies from their roles.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to remove policies from RBAC roles within your custom flows.
 *
 * @example
 * const { result } = await deleteRbacRolePoliciesWorkflow(container)
 * .run({
 *   input: {
 *     role_policy_ids: ["rolepol_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more RBAC role-policy assignments.
 *
 * @featureFlag rbac
 */
export const deleteRbacRolePoliciesWorkflow = createWorkflow(
  deleteRbacRolePoliciesWorkflowId,
  (input: WorkflowData<DeleteRbacRolePoliciesWorkflowInput>) => {
    const deletedRolePolicies = deleteRbacRolePoliciesStep(
      input.role_policy_ids
    )

    return new WorkflowResponse(deletedRolePolicies)
  }
)
