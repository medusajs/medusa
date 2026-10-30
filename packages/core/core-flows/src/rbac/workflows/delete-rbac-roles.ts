import { Modules } from "@medusajs/framework/utils"
import {
  WorkflowData,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteRbacRolesStep } from "../steps"
import { validateActorRolePermissionsStep } from "../steps/validate-actor-role-permissions"

/**
 * @ignore
 */
export type DeleteRbacRolesWorkflowInput = {
  ids: string[]
  /**
   * The actor deleting the roles. When provided, the actor must hold every
   * policy of the roles being deleted, mirroring the check applied when
   * assigning or unassigning them. Omit for trusted system code.
   */
  actor_id?: string
  /**
   * The actor's type. Defaults to `user`.
   */
  actor?: string
}

/**
 * @ignore
 */
export const deleteRbacRolesWorkflowId = "delete-rbac-roles"

/**
 * This workflow deletes RBAC roles. When an actor is provided, it validates
 * that the actor holds every policy of the roles being deleted, so that an
 * actor cannot delete roles more privileged than themselves.
 * @ignore
 */
export const deleteRbacRolesWorkflow = createWorkflow(
  deleteRbacRolesWorkflowId,
  (input: WorkflowData<DeleteRbacRolesWorkflowInput>): WorkflowData<void> => {
    when(
      { input },
      ({ input }) => !!input.actor_id && !!input.ids?.length
    ).then(() => {
      const validationData = transform({ input }, ({ input }) => ({
        actor_id: input.actor_id!,
        actor: input.actor,
        assignments: input.ids.map((role_id) => ({ role_id })),
      }))

      validateActorRolePermissionsStep(validationData)
    })

    deleteRbacRolesStep(input.ids)

    removeRemoteLinkStep({
      [Modules.RBAC]: { rbac_role_id: input.ids },
    })
  }
)
