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
 * @since 2.22.3
 */
export type GetAssignableRolesWorkflowInput = GetAssignableRolesStepInput

/**
 * @since 2.22.3
 */
export type GetAssignableRolesWorkflowOutput = GetAssignableRolesStepOutput

/**
 * @since 2.22.3
 */
export const getAssignableRolesWorkflowId = "get-assignable-roles-workflow"

/**
 * Returns the set of `rbac_role`s that the actor is allowed to assign.
 *
 * @since 2.22.3
 */
export const getAssignableRolesWorkflow = createWorkflow(
  getAssignableRolesWorkflowId,
  (input: WorkflowData<GetAssignableRolesWorkflowInput>) => {
    const result = getAssignableRolesStep(input)
    return new WorkflowResponse(result)
  }
)
