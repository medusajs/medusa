import { ModuleJoinerConfig } from "@medusajs/framework/types"
import {
  defineFileConfig,
  FeatureFlag,
  LINKS,
  Modules,
} from "@medusajs/framework/utils"

// Legacy link, superseded by rbac_role_assignment (see invite-rbac-role-assignment.ts).
// Kept registered WITHOUT its former `extends` field aliases (those now belong to the
// read-only assignment link) so that link-sync keeps owning the invite_rbac_role table
// and `db:migrate` does not prompt to drop it before the role-assignment migration
// script has copied its rows. Will be deleted in the future.
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
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("rbac"),
})
