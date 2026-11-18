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
 * @since 2.22.3
 */
export type GetAssignablePoliciesWorkflowInput = GetAssignablePoliciesStepInput

/**
 * @since 2.22.3
 */
export type GetAssignablePoliciesWorkflowOutput =
  GetAssignablePoliciesStepOutput

/**
 * @since 2.22.3
 */
export const getAssignablePoliciesWorkflowId =
  "get-assignable-policies-workflow"

/**
 * Returns the set of `rbac_policy` rows the actor is allowed to assign.
 *
 * @since 2.22.3
 */
export const getAssignablePoliciesWorkflow = createWorkflow(
  getAssignablePoliciesWorkflowId,
  (input: WorkflowData<GetAssignablePoliciesWorkflowInput>) => {
    const result = getAssignablePoliciesStep(input)
    return new WorkflowResponse(result)
  }
)
