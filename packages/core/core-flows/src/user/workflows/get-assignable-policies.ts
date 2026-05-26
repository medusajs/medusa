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
 * @ignore
 * @featureFlag rbac
 */
export type GetAssignablePoliciesWorkflowInput = GetAssignablePoliciesStepInput

/**
 * @ignore
 * @featureFlag rbac
 */
export type GetAssignablePoliciesWorkflowOutput =
  GetAssignablePoliciesStepOutput

/**
 * @ignore
 * @featureFlag rbac
 */
export const getAssignablePoliciesWorkflowId =
  "get-assignable-policies-workflow"

/**
 * Returns the set of `rbac_policy` rows the actor is allowed to assign.
 *
 * @ignore
 * @featureFlag rbac
 */
export const getAssignablePoliciesWorkflow = createWorkflow(
  getAssignablePoliciesWorkflowId,
  (input: WorkflowData<GetAssignablePoliciesWorkflowInput>) => {
    const result = getAssignablePoliciesStep(input)
    return new WorkflowResponse(result)
  }
)
