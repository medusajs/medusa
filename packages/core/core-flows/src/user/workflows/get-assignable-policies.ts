import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import {
  GetAssignablePoliciesStepInput,
  GetAssignablePoliciesStepOutput,
  getAssignablePoliciesStep,
} from "../steps/get-assignable-policies"

/**
 * The data to retrieve the policies an actor can assign.
 *
 * @since 2.16.0
 */
export type GetAssignablePoliciesWorkflowInput = GetAssignablePoliciesStepInput

/**
 * The policies that the actor is allowed to assign.
 *
 * @since 2.16.0
 */
export type GetAssignablePoliciesWorkflowOutput =
  GetAssignablePoliciesStepOutput

/**
 * @featureFlag rbac
 * @since 2.16.0
 */
export const getAssignablePoliciesWorkflowId =
  "get-assignable-policies-workflow"

/**
 * This workflow retrieves the set of RBAC policies that an actor is allowed to assign.
 * An actor can only assign policies they themselves have access to.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to retrieve the policies an actor can assign within your custom flows.
 *
 * @example
 * const { result } = await getAssignablePoliciesWorkflow(container)
 * .run({
 *   input: {
 *     actor_id: "user_123"
 *   }
 * })
 *
 * @summary
 *
 * Retrieve the RBAC policies an actor can assign.
 *
 * @featureFlag rbac
 * @since 2.16.0
 */
export const getAssignablePoliciesWorkflow = createWorkflow(
  getAssignablePoliciesWorkflowId,
  (input: WorkflowData<GetAssignablePoliciesWorkflowInput>) => {
    const result = getAssignablePoliciesStep(input)
    return new WorkflowResponse(result)
  }
)
