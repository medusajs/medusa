import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteRbacPoliciesStep } from "../steps"

/**
 * @ignore
 * @featureFlag rbac
 */
export type DeleteRbacPoliciesWorkflowInput = {
  ids: string[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const deleteRbacPoliciesWorkflowId = "delete-rbac-policies"

/**
 * @ignore
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
