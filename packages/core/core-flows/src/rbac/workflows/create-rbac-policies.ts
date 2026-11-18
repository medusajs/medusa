import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { CreateRbacPolicyDTO } from "@medusajs/framework/types"
import { createRbacPoliciesStep } from "../steps"

/**
 * @since 2.22.3
 */
export type CreateRbacPoliciesWorkflowInput = {
  policies: CreateRbacPolicyDTO[]
}

/**
 * @since 2.22.3
 */
export const createRbacPoliciesWorkflowId = "create-rbac-policies"

/**
 * @since 2.22.3
 */
export const createRbacPoliciesWorkflow = createWorkflow(
  createRbacPoliciesWorkflowId,
  (input: WorkflowData<CreateRbacPoliciesWorkflowInput>) => {
    return new WorkflowResponse(createRbacPoliciesStep(input))
  }
)
