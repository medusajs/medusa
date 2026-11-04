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
 * @ignore
 */
export type UpdateRbacPoliciesWorkflowInput = {
  selector: FilterableRbacPolicyProps
  update: Omit<UpdateRbacPolicyDTO, "id">
}

/**
 * @ignore
 */
export const updateRbacPoliciesWorkflowId = "update-rbac-policies"

/**
 * @ignore
 */
export const updateRbacPoliciesWorkflow = createWorkflow(
  updateRbacPoliciesWorkflowId,
  (input: WorkflowData<UpdateRbacPoliciesWorkflowInput>) => {
    return new WorkflowResponse(updateRbacPoliciesStep(input))
  }
)
