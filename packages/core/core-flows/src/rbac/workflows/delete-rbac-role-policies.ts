import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteRbacRolePoliciesStep } from "../steps"

/**
 * @ignore
 * @featureFlag rbac
 */
export type DeleteRbacRolePoliciesWorkflowInput = {
  role_policy_ids: string[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const deleteRbacRolePoliciesWorkflowId = "delete-rbac-role-policies"

/**
 * @ignore
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
