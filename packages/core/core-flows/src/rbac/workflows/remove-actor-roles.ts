import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { dismissRemoteLinkStep } from "../../common/steps/dismiss-remote-links"
import { validateActorRolePermissionsStep } from "../steps/validate-actor-role-permissions"
import { LinkDefinition } from "@medusajs/framework/types"

/**
 * @ignore
 * @featureFlag rbac
 */
export type RemoveActorRolesWorkflowInput = {
  granting_actor_id: string
  granting_actor: string
  granted_actor: string
  granted_actor_id: string | string[]
  role_id: string | string[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const removeActorRolesWorkflowId = "remove-actor-roles"

/**
 * This workflow removes roles from an actor.
 * Supports two modes:
 * - Remove multiple roles from a single actor: { actor_id, role_ids }
 * - Remove multiple actors from a single role: { actor_ids, role_id }
 * It validates that the actor has all the policies from the roles being removed.
 * @ignore
 * @featureFlag rbac
 */
export const removeActorRolesWorkflow = createWorkflow(
  removeActorRolesWorkflowId,
  (input: WorkflowData<RemoveActorRolesWorkflowInput>) => {
    const normalizedInput = transform({ input }, ({ input }) => {
      return {
        grantingActorId: input.granting_actor_id,
        grantingActor: input.granting_actor,
        grantedActor: input.granted_actor,
        grantedActorIds: Array.isArray(input.granted_actor_id)
          ? input.granted_actor_id
          : [input.granted_actor_id],
        roleIds: Array.isArray(input.role_id) ? input.role_id : [input.role_id],
      }
    })

    validateActorRolePermissionsStep({
      actor_id: input.granting_actor_id,
      role_ids: normalizedInput.roleIds,
      actor: input.granting_actor,
    })

    const grantedActorRoleLinks = transform(
      { normalizedInput },
      ({ normalizedInput }) => {
        const links: LinkDefinition[] = []

        for (const grantedActorId of normalizedInput.grantedActorIds) {
          for (const roleId of normalizedInput.roleIds) {
            links.push({
              [normalizedInput.grantedActor]: {
                [`${normalizedInput.grantedActor}_id`]: grantedActorId,
              },
              rbac: { rbac_role_id: roleId },
            })
          }
        }
        return links
      }
    )

    dismissRemoteLinkStep(grantedActorRoleLinks)

    return new WorkflowResponse(void 0)
  }
)
