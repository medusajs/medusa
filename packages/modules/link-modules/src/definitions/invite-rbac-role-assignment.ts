import { ModuleJoinerConfig } from "@medusajs/framework/types"
import {
  defineFileConfig,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"

/**
 * Read-only link exposing the `rbac_roles` graph field on `Invite`, resolved
 * through the polymorphic `rbac_role_assignment` table. It joins
 * `Invite.id -> RbacRoleAssignment.reference_id` and shortcuts the assignment's
 * `role` relation, allowing the `fields=rbac_roles.*` query on invites.
 */
export const InviteRbacRoleAssignment: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.USER,
      entity: "Invite",
      fieldAlias: {
        rbac_roles: {
          path: "invite_role_assignments.role",
          isList: true,
        },
      },
      relationship: {
        serviceName: Modules.RBAC,
        entity: "RbacRoleAssignment",
        primaryKey: "reference_id",
        foreignKey: "id",
        alias: "invite_role_assignments",
        isList: true,
      },
    },
  ],
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("rbac"),
})
