import { canActorGrantRoles } from "@medusajs/core-flows"
import { AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { HttpTypes, IRbacModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Strips the token from the invites whose roles the authenticated actor can't
 * assign. Accepting an invite grants its roles, so its token is only shown to
 * actors who could have created that invite themselves.
 */
export const redactInviteTokens = async (
  req: AuthenticatedMedusaRequest<unknown, any>,
  invites: HttpTypes.AdminInvite[]
): Promise<HttpTypes.AdminInvite[]> => {
  if (!MedusaModule.isInstalled(Modules.RBAC) || !invites.length) {
    return invites
  }

  const rbacModule = req.scope.resolve<IRbacModuleService>(Modules.RBAC)
  const assignments = await rbacModule.listRbacRoleAssignments(
    { reference: "invite", reference_id: invites.map((invite) => invite.id) },
    { select: ["reference_id", "role_id", "scope", "scope_id"] }
  )

  const verdicts = await canActorGrantRoles({
    container: req.scope,
    actor_id: req.auth_context.actor_id,
    actor: req.auth_context.actor_type,
    granting_scope: req.rbac_context?.scope,
    assignments: assignments.map((assignment) => ({
      role_id: assignment.role_id,
      scope:
        assignment.scope && assignment.scope_id
          ? { type: assignment.scope, id: assignment.scope_id }
          : undefined,
    })),
  })

  const hidden = new Set(
    assignments
      .filter((_, index) => !verdicts[index])
      .map((assignment) => assignment.reference_id)
  )

  return invites.map((invite) => {
    const shouldRedactToken = hidden.has(invite.id)
    const token = invite.token

    return { ...invite, token: shouldRedactToken ? undefined : token }
  })
}

export const refetchInvite = async (
  req: AuthenticatedMedusaRequest<unknown, any>,
  inviteId: string
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: invites } = await query.graph({
    entity: "invite",
    filters: { id: inviteId },
    ...req.queryConfig,
  })

  const [invite] = await redactInviteTokens(req, invites)

  return invite
}
