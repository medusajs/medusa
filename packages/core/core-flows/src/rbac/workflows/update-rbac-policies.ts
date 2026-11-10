import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import {
  FilterableRbacPolicyProps,
  UpdateRbacPolicyDTO,
} from "@medusajs/framework/types"
import { updateRbacPoliciesStep } from "../steps/update-rbac-policies"

/**
 * @since 2.22.3
 */
export type UpdateRbacPoliciesWorkflowInput = {
  selector: FilterableRbacPolicyProps
  update: Omit<UpdateRbacPolicyDTO, "id">
}

/**
 * @since 2.22.3
 */
export const updateRbacPoliciesWorkflowId = "update-rbac-policies"

/**
 * @since 2.22.3
 */
export const updateRbacPoliciesWorkflow = createWorkflow(
  updateRbacPoliciesWorkflowId,
  (input: WorkflowData<UpdateRbacPoliciesWorkflowInput>) => {
    return new WorkflowResponse(updateRbacPoliciesStep(input))
  }
)
