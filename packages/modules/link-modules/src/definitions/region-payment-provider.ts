import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS, Modules } from "@medusajs/utils"

export const RegionPaymentProvider: ModuleJoinerConfig = {
  serviceName: LINKS.RegionPaymentProvider,
  isLink: true,
  databaseConfig: {
    tableName: "region_payment_provider",
    idPrefix: "regpp",
  },
  alias: [
    {
      name: ["region_payment_provider", "region_payment_providers"],
      args: {
        entity: "LinkRegionPaymentProvider",
      },
    },
  ],
  primaryKeys: ["id", "region_id", "payment_provider_id"],
  relationships: [
    {
      serviceName: Modules.REGION,
      primaryKey: "id",
      foreignKey: "region_id",
      alias: "region",
      args: {
        methodSuffix: "Regions",
      },
    },
    {
      serviceName: Modules.PAYMENT,
      primaryKey: "id",
      foreignKey: "payment_provider_id",
      alias: "payment_provider",
      args: { methodSuffix: "PaymentProviders" },
    },
  ],
  extends: [
    {
      serviceName: Modules.REGION,
      fieldAlias: {
        payment_providers: {
          path: "payment_provider_link.payment_provider",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.RegionPaymentProvider,
        primaryKey: "region_id",
        foreignKey: "id",
        alias: "payment_provider_link",
        isList: true,
      },
    },
    {
      serviceName: Modules.PAYMENT,
      fieldAlias: {
        regions: {
          path: "region_link.region",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.RegionPaymentProvider,
        primaryKey: "payment_provider_id",
        foreignKey: "id",
        alias: "region_link",
        isList: true,
      },
    },
  ],
}
