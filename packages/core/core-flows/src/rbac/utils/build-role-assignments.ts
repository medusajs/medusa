import {
  CreateActorRoleDTO,
  CreateRbacRoleAssignmentDTO,
} from "@medusajs/framework/types"

/**
 * Builds the role assignments of a reference entity (e.g. a user or an invite)
 * from the roles it was created with. A role with scopes results in one
 * assignment per scope, a role without scopes in a single unscoped assignment.
 *
 * @ignore
 * @featureFlag rbac
 */
export const buildRoleAssignments = (
  roles: CreateActorRoleDTO[] | null | undefined,
  reference: string,
  referenceId: string
): CreateRbacRoleAssignmentDTO[] => {
  return (roles ?? []).flatMap((role) => {
    if (!role.scopes?.length) {
      return [
        {
          role_id: role.role_id,
          reference,
          reference_id: referenceId,
        },
      ]
    }

    return role.scopes.map((scope) => ({
      role_id: role.role_id,
      reference,
      reference_id: referenceId,
      scope: scope.type,
      scope_id: scope.id,
    }))
  })
}
