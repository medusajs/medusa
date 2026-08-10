import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { CreateRbacPolicyDTO } from "@medusajs/framework/types"
import { createRbacPoliciesStep } from "../steps"

/**
 * @ignore
 * @featureFlag rbac
 */
export type CreateRbacPoliciesWorkflowInput = {
  policies: CreateRbacPolicyDTO[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const createRbacPoliciesWorkflowId = "create-rbac-policies"

/**
 * @ignore
 * @featureFlag rbac
 */
export const createRbacPoliciesWorkflow = createWorkflow(
  createRbacPoliciesWorkflowId,
  (input: WorkflowData<CreateRbacPoliciesWorkflowInput>) => {
    return new WorkflowResponse(createRbacPoliciesStep(input))
  }
)
