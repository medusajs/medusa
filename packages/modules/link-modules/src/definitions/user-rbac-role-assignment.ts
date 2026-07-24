import { ModuleJoinerConfig } from "@medusajs/framework/types"
import {
  defineFileConfig,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"

/**
 * Read-only link exposing the `rbac_roles` graph field on `User`, resolved
 * through the polymorphic `rbac_role_assignment` table. It joins
 * `User.id -> RbacRoleAssignment.reference_id` and shortcuts the assignment's
 * `role` relation, allowing the `fields=rbac_roles.*` query on users.
 */
export const UserRbacRoleAssignment: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.USER,
      entity: "User",
      fieldAlias: {
        rbac_roles: {
          path: "user_role_assignments.role",
          isList: true,
        },
      },
      relationship: {
        serviceName: Modules.RBAC,
        entity: "RbacRoleAssignment",
        primaryKey: "reference_id",
        foreignKey: "id",
        alias: "user_role_assignments",
        isList: true,
      },
    },
  ],
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("rbac"),
})
