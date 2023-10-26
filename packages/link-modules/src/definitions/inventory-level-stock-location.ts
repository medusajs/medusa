import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export const InventoryLevelStockLocation: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.INVENTORY,
      relationship: {
        serviceName: Modules.STOCK_LOCATION,
        primaryKey: "id",
        foreignKey: "location_id",
        alias: "stock_locations",
        isList: true,
      },
    },
  ],
}
