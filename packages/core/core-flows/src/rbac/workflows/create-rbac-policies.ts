import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createRbacPoliciesStep } from "../steps"

/**
 * The data to create RBAC policies.
 */
export type CreateRbacPoliciesWorkflowInput = {
  /**
   * The policies to create. Each policy defines a permission on a resource and
   * operation.
   */
  policies: any[]
}

/**
 * @featureFlag rbac
 */
export const createRbacPoliciesWorkflowId = "create-rbac-policies"

/**
 * This workflow creates one or more RBAC policies. A policy grants a permission to
 * perform an operation on a resource, and can later be assigned to roles.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to create RBAC policies within your custom flows.
 *
 * @example
 * const { result } = await createRbacPoliciesWorkflow(container)
 * .run({
 *   input: {
 *     policies: [
 *       {
 *         resource: "order",
 *         operation: "read"
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more RBAC policies.
 *
 * @featureFlag rbac
 */
export const createRbacPoliciesWorkflow = createWorkflow(
  createRbacPoliciesWorkflowId,
  (input: WorkflowData<CreateRbacPoliciesWorkflowInput>) => {
    return new WorkflowResponse(createRbacPoliciesStep(input))
  }
)
