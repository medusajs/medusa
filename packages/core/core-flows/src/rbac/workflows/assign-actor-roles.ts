import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep } from "../../common/steps/create-remote-links"
import { validateRolesExistStep } from "../steps/validate-roles-exist"
import { validateActorRolePermissionsStep } from "../steps/validate-actor-role-permissions"
import { LinkDefinition } from "@medusajs/framework/types"

/**
 * @ignore
 * @featureFlag rbac
 */
export type AssignActorRolesWorkflowInput = {
  granting_actor_id: string
  granting_actor: string
  granted_actor_id: string | string[]
  granted_actor: string
  role_id: string | string[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const assignActorRolesWorkflowId = "assign-actor-roles"

/**
 * This workflow assigns roles to actors.
 * Supports two modes:
 * - Assign multiple roles to a single actor: { actor_id, role_ids }
 * - Assign multiple actors to a single role: { actor_ids, role_id }
 * It validates that the actor has all the policies from the roles being assigned.
 * @ignore
 * @featureFlag rbac
 */
export const assignActorRolesWorkflow = createWorkflow(
  assignActorRolesWorkflowId,
  (input: WorkflowData<AssignActorRolesWorkflowInput>) => {
    const normalizedInput = transform({ input }, ({ input }) => {
      return {
        grantingActorId: input.granting_actor_id,
        grantingActor: input.granting_actor,
        grantedActorIds: Array.isArray(input.granted_actor_id)
          ? input.granted_actor_id
          : [input.granted_actor_id],
        grantedActor: input.granted_actor,
        roleIds: Array.isArray(input.role_id) ? input.role_id : [input.role_id],
      }
    })

    validateRolesExistStep(normalizedInput.roleIds)

    validateActorRolePermissionsStep({
      actor_id: normalizedInput.grantingActorId,
      actor: normalizedInput.grantingActor,
      role_ids: normalizedInput.roleIds,
    })

    const actorRoleLinks = transform(
      { normalizedInput },
      ({ normalizedInput }) => {
        const actorIds = normalizedInput.grantedActorIds
        const roles = normalizedInput.roleIds

        const links: LinkDefinition[] = []
        for (const actorId of actorIds) {
          for (const roleId of roles) {
            links.push({
              [normalizedInput.grantedActor]: {
                [`${normalizedInput.grantedActor}_id`]: actorId,
              },
              rbac: { rbac_role_id: roleId },
            })
          }
        }
        return links
      }
    )

    createRemoteLinkStep(actorRoleLinks)

    return new WorkflowResponse(void 0)
  }
)
