import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { UpdateRbacRolePolicyDTO } from "@zjedene-medusa/types"
import { updateRbacRolePoliciesStep } from "../steps/update-rbac-role-policies"

/**
 * @ignore
 * @featureFlag rbac
 */
export type UpdateRbacRolePoliciesWorkflowInput = {
  selector: Record<string, any>
  update: Omit<UpdateRbacRolePolicyDTO, "id">
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const updateRbacRolePoliciesWorkflowId = "update-rbac-role-policies"

/**
 * @ignore
 * @featureFlag rbac
 */
export const updateRbacRolePoliciesWorkflow = createWorkflow(
  updateRbacRolePoliciesWorkflowId,
  (input: WorkflowData<UpdateRbacRolePoliciesWorkflowInput>) => {
    return new WorkflowResponse(updateRbacRolePoliciesStep(input))
  }
)
