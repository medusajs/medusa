import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { LINKS, Modules } from "@medusajs/framework/utils"

export const InviteRbacRole: ModuleJoinerConfig = {
  serviceName: LINKS.InviteRbacRole,
  isLink: true,
  databaseConfig: {
    tableName: "invite_rbac_role",
    idPrefix: "inviterole",
  },
  alias: [
    {
      name: "invite_rbac_role",
    },
    {
      name: "invite_rbac_roles",
    },
  ],
  primaryKeys: ["id", "invite_id", "rbac_role_id"],
  relationships: [
    {
      serviceName: Modules.USER,
      entity: "Invite",
      primaryKey: "id",
      foreignKey: "invite_id",
      alias: "invite",
      args: {
        methodSuffix: "Invites",
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
      entity: "Invite",
      fieldAlias: {
        rbac_roles: {
          path: "rbac_roles_link.rbac_role",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.InviteRbacRole,
        primaryKey: "invite_id",
        foreignKey: "id",
        alias: "rbac_roles_link",
        isList: true,
      },
    },
    {
      serviceName: Modules.RBAC,
      entity: "RbacRole",
      relationship: {
        serviceName: LINKS.InviteRbacRole,
        primaryKey: "rbac_role_id",
        foreignKey: "id",
        alias: "invites_link",
        isList: true,
      },
    },
  ],
}
