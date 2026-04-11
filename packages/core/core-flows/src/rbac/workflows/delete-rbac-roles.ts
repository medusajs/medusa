import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteRbacRolesStep } from "../steps"

/**
 * @ignore
 * @featureFlag rbac
 */
export type DeleteRbacRolesWorkflowInput = {
  ids: string[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const deleteRbacRolesWorkflowId = "delete-rbac-roles"

/**
 * @ignore
 * @featureFlag rbac
 */
export const deleteRbacRolesWorkflow = createWorkflow(
  deleteRbacRolesWorkflowId,
  (input: WorkflowData<DeleteRbacRolesWorkflowInput>): WorkflowData<void> => {
    deleteRbacRolesStep(input.ids)
  }
)
