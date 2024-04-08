import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export const OrderRegion: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.ORDER,
      relationship: {
        serviceName: Modules.REGION,
        primaryKey: "id",
        foreignKey: "region_id",
        alias: "region",
      },
    },
    {
      serviceName: Modules.REGION,
      relationship: {
        serviceName: Modules.ORDER,
        primaryKey: "region_id",
        foreignKey: "id",
        alias: "orders",
        isList: true,
      },
    },
  ],
}
