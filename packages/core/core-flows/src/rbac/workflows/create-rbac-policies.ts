import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createRbacPoliciesStep } from "../steps"

/**
 * @ignore
 * @featureFlag rbac
 */
export type CreateRbacPoliciesWorkflowInput = {
  policies: any[]
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
