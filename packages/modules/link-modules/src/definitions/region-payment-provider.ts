import { ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { LINKS, Modules } from "@zjedene-medusa/framework/utils"

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
      entity: "LinkRegionPaymentProvider",
    },
  ],
  primaryKeys: ["id", "region_id", "payment_provider_id"],
  relationships: [
    {
      serviceName: Modules.REGION,
      entity: "Region",
      primaryKey: "id",
      foreignKey: "region_id",
      alias: "region",
      args: {
        methodSuffix: "Regions",
      },
      hasMany: true,
    },
    {
      serviceName: Modules.PAYMENT,
      entity: "PaymentProvider",
      primaryKey: "id",
      foreignKey: "payment_provider_id",
      alias: "payment_provider",
      args: { methodSuffix: "PaymentProviders" },
      hasMany: true,
    },
  ],
  extends: [
    {
      serviceName: Modules.REGION,
      entity: "Region",
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
      entity: "PaymentProvider",
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
