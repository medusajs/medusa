import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { CreateRbacPolicyDTO } from "@medusajs/framework/types"
import { createRbacPoliciesStep } from "../steps"

/**
 * @ignore
 */
export type CreateRbacPoliciesWorkflowInput = {
  policies: CreateRbacPolicyDTO[]
}

/**
 * @ignore
 */
export const createRbacPoliciesWorkflowId = "create-rbac-policies"

/**
 * @ignore
 */
export const createRbacPoliciesWorkflow = createWorkflow(
  createRbacPoliciesWorkflowId,
  (input: WorkflowData<CreateRbacPoliciesWorkflowInput>) => {
    return new WorkflowResponse(createRbacPoliciesStep(input))
  }
)
