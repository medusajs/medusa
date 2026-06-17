import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteRbacRolesStep } from "../steps"

/**
 * The data to delete RBAC roles.
 */
export type DeleteRbacRolesWorkflowInput = {
  /**
   * The IDs of the roles to delete.
   */
  ids: string[]
}

/**
 * @featureFlag rbac
 */
export const deleteRbacRolesWorkflowId = "delete-rbac-roles"

/**
 * This workflow deletes one or more RBAC roles.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to delete RBAC roles within your custom flows.
 *
 * @example
 * const { result } = await deleteRbacRolesWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["role_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more RBAC roles.
 *
 * @featureFlag rbac
 */
export const deleteRbacRolesWorkflow = createWorkflow(
  deleteRbacRolesWorkflowId,
  (input: WorkflowData<DeleteRbacRolesWorkflowInput>): WorkflowData<void> => {
    deleteRbacRolesStep(input.ids)
  }
)
