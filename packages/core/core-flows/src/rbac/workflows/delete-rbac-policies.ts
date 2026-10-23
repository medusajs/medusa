import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteRbacPoliciesStep } from "../steps"

/**
 * @ignore
 */
export type DeleteRbacPoliciesWorkflowInput = {
  ids: string[]
}

/**
 * @ignore
 */
export const deleteRbacPoliciesWorkflowId = "delete-rbac-policies"

/**
 * @ignore
 */
export const deleteRbacPoliciesWorkflow = createWorkflow(
  deleteRbacPoliciesWorkflowId,
  (
    input: WorkflowData<DeleteRbacPoliciesWorkflowInput>
  ): WorkflowData<void> => {
    deleteRbacPoliciesStep(input.ids)
  }
)
