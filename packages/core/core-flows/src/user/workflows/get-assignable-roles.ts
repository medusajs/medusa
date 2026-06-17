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
 * The data to retrieve the roles an actor can assign.
 */
export type GetAssignableRolesWorkflowInput = GetAssignableRolesStepInput

/**
 * The roles that the actor is allowed to assign.
 */
export type GetAssignableRolesWorkflowOutput = GetAssignableRolesStepOutput

/**
 * @featureFlag rbac
 */
export const getAssignableRolesWorkflowId = "get-assignable-roles-workflow"

/**
 * This workflow retrieves the set of RBAC roles that an actor is allowed to assign. An
 * actor can only assign roles whose policies they themselves have access to.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to retrieve the roles an actor can assign within your custom flows.
 *
 * @example
 * const { result } = await getAssignableRolesWorkflow(container)
 * .run({
 *   input: {
 *     actor_id: "user_123"
 *   }
 * })
 *
 * @summary
 *
 * Retrieve the RBAC roles an actor can assign.
 *
 * @featureFlag rbac
 */
export const getAssignableRolesWorkflow = createWorkflow(
  getAssignableRolesWorkflowId,
  (input: WorkflowData<GetAssignableRolesWorkflowInput>) => {
    const result = getAssignableRolesStep(input)
    return new WorkflowResponse(result)
  }
)
