import { Modules } from "@medusajs/framework/utils"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteRbacRolesStep } from "../steps"

/**
 * @ignore
 */
export type DeleteRbacRolesWorkflowInput = {
  ids: string[]
}

/**
 * @ignore
 */
export const deleteRbacRolesWorkflowId = "delete-rbac-roles"

/**
 * @ignore
 */
export const deleteRbacRolesWorkflow = createWorkflow(
  deleteRbacRolesWorkflowId,
  (input: WorkflowData<DeleteRbacRolesWorkflowInput>): WorkflowData<void> => {
    deleteRbacRolesStep(input.ids)

    removeRemoteLinkStep({
      [Modules.RBAC]: { rbac_role_id: input.ids },
    })
  }
)
