import { ModuleJoinerConfig } from "@medusajs/framework/types"
import {
  defineFileConfig,
  FeatureFlag,
  LINKS,
  Modules,
} from "@medusajs/framework/utils"

// Legacy link, superseded by rbac_role_assignment (see user-rbac-role-assignment.ts).
// Kept registered WITHOUT its former `extends` field aliases (those now belong to the
// read-only assignment link) so that link-sync keeps owning the user_rbac_role table
// and `db:migrate` does not prompt to drop it before the role-assignment migration
// script has copied its rows. Will be deleted in the future.
export const UserRbacRole: ModuleJoinerConfig = {
  serviceName: LINKS.UserRbacRole,
  isLink: true,
  databaseConfig: {
    tableName: "user_rbac_role",
    idPrefix: "userrole",
  },
  alias: [
    {
      name: "user_rbac_role",
    },
    {
      name: "user_rbac_roles",
    },
  ],
  primaryKeys: ["id", "user_id", "rbac_role_id"],
  relationships: [
    {
      serviceName: Modules.USER,
      entity: "User",
      primaryKey: "id",
      foreignKey: "user_id",
      alias: "user",
      args: {
        methodSuffix: "Users",
      },
      hasMany: true,
    },
    {
      serviceName: Modules.RBAC,
      entity: "RbacRole",
      primaryKey: "id",
      foreignKey: "rbac_role_id",
      alias: "rbac_role",
      args: {
        methodSuffix: "RbacRoles",
      },
      hasMany: true,
    },
  ],
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("rbac"),
})
