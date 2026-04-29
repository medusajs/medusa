import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { UpdateRbacPolicyDTO } from "@medusajs/types"
import { updateRbacPoliciesStep } from "../steps/update-rbac-policies"

/**
 * @ignore
 * @featureFlag rbac
 */
export type UpdateRbacPoliciesWorkflowInput = {
  selector: Record<string, any>
  update: Omit<UpdateRbacPolicyDTO, "id">
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const updateRbacPoliciesWorkflowId = "update-rbac-policies"

/**
 * @ignore
 * @featureFlag rbac
 */
export const updateRbacPoliciesWorkflow = createWorkflow(
  updateRbacPoliciesWorkflowId,
  (input: WorkflowData<UpdateRbacPoliciesWorkflowInput>) => {
    return new WorkflowResponse(updateRbacPoliciesStep(input))
  }
)
