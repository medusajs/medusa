import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteRbacPoliciesStep } from "../steps"

/**
 * The data to delete RBAC policies.
 */
export type DeleteRbacPoliciesWorkflowInput = {
  /**
   * The IDs of the policies to delete.
   */
  ids: string[]
}

/**
 * @featureFlag rbac
 */
export const deleteRbacPoliciesWorkflowId = "delete-rbac-policies"

/**
 * This workflow deletes one or more RBAC policies.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to delete RBAC policies within your custom flows.
 *
 * @example
 * const { result } = await deleteRbacPoliciesWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["pol_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more RBAC policies.
 *
 * @featureFlag rbac
 */
export const deleteRbacPoliciesWorkflow = createWorkflow(
  deleteRbacPoliciesWorkflowId,
  (
    input: WorkflowData<DeleteRbacPoliciesWorkflowInput>
  ): WorkflowData<void> => {
    deleteRbacPoliciesStep(input.ids)
  }
)
