import { ModuleJoinerConfig } from "@medusajs/framework/types"
import {
  defineFileConfig,
  FeatureFlag,
  LINKS,
  Modules,
} from "@medusajs/framework/utils"

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
  extends: [
    {
      serviceName: Modules.USER,
      entity: "User",
      fieldAlias: {
        rbac_roles: {
          path: "rbac_roles_link.rbac_role",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.UserRbacRole,
        primaryKey: "user_id",
        foreignKey: "id",
        alias: "rbac_roles_link",
        isList: true,
      },
    },
    {
      serviceName: Modules.RBAC,
      entity: "RbacRole",
      relationship: {
        serviceName: LINKS.UserRbacRole,
        primaryKey: "rbac_role_id",
        foreignKey: "id",
        alias: "users_link",
        isList: true,
      },
    },
  ],
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("rbac"),
})
