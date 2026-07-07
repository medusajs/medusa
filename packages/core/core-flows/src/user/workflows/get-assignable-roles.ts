import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import {
  getAssignableRolesStep,
  GetAssignableRolesStepInput,
  GetAssignableRolesStepOutput,
} from "../steps/get-assignable-roles"

/**
 * @ignore
 * @featureFlag rbac
 */
export type GetAssignableRolesWorkflowInput = GetAssignableRolesStepInput

/**
 * @ignore
 * @featureFlag rbac
 */
export type GetAssignableRolesWorkflowOutput = GetAssignableRolesStepOutput

/**
 * @ignore
 * @featureFlag rbac
 */
export const getAssignableRolesWorkflowId = "get-assignable-roles-workflow"

/**
 * Returns the set of `rbac_role`s that the actor is allowed to assign.
 *
 * @ignore
 * @featureFlag rbac
 */
export const getAssignableRolesWorkflow = createWorkflow(
  getAssignableRolesWorkflowId,
  (input: WorkflowData<GetAssignableRolesWorkflowInput>) => {
    const result = getAssignableRolesStep(input)
    return new WorkflowResponse(result)
  }
)
