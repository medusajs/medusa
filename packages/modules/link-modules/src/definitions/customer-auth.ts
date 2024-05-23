import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

export const CustomerAuth: ModuleJoinerConfig = {
  serviceName: LINKS.CustomerAuth,
  isLink: true,
  databaseConfig: {
    tableName: "customer_auth_identity",
    idPrefix: "cusauth",
  },
  alias: [
    {
      name: "customer_auth_identity",
    },
    {
      name: "customer_auth_identities",
    },
  ],
  primaryKeys: ["id", "customer_id", "auth_identity_id"],
  relationships: [
    {
      serviceName: Modules.CUSTOMER,
      primaryKey: "id",
      foreignKey: "customer_id",
      alias: "customer",
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
      serviceName: Modules.CUSTOMER,
      fieldAlias: {
        auth_identity: "auth_link.auth_identity",
      },
      relationship: {
        serviceName: LINKS.CustomerAuth,
        primaryKey: "customer_id",
        foreignKey: "id",
        alias: "auth_link",
      },
    },
    {
      serviceName: Modules.AUTH,
      fieldAlias: {
        customer: "customer_link.customer",
      },
      relationship: {
        serviceName: LINKS.CustomerAuth,
        primaryKey: "auth_identity_id",
        foreignKey: "id",
        alias: "customer_link",
      },
    },
  ],
}
