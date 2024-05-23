import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

export const UserAuth: ModuleJoinerConfig = {
  serviceName: LINKS.UserAuth,
  isLink: true,
  databaseConfig: {
    tableName: "user_auth_identity",
    idPrefix: "usrauth",
  },
  alias: [
    {
      name: "user_auth_identity",
    },
    {
      name: "user_auth_identities",
    },
  ],
  primaryKeys: ["id", "user_id", "auth_identity_id"],
  relationships: [
    {
      serviceName: Modules.USER,
      primaryKey: "id",
      foreignKey: "user_id",
      alias: "user",
    },
    {
      serviceName: Modules.AUTH,
      primaryKey: "id",
      foreignKey: "auth_identity_id",
      alias: "auth",
    },
  ],
  extends: [
    {
      serviceName: Modules.USER,
      fieldAlias: {
        auth_identity: "auth_link.auth_identity",
      },
      relationship: {
        serviceName: LINKS.UserAuth,
        primaryKey: "user_id",
        foreignKey: "id",
        alias: "auth_link",
      },
    },
    {
      serviceName: Modules.AUTH,
      fieldAlias: {
        user: "user_link.user",
      },
      relationship: {
        serviceName: LINKS.UserAuth,
        primaryKey: "auth_identity_id",
        foreignKey: "id",
        alias: "user_link",
      },
    },
  ],
}
