import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const InventoryLevelStockLocation: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.INVENTORY,
      relationship: {
        serviceName: Modules.STOCK_LOCATION,
        entity: "StockLocation",
        primaryKey: "id",
        foreignKey: "location_id",
        alias: "stock_locations",
        args: {
          methodSuffix: "StockLocations",
        },
        isList: true,
      },
    },
  ],
}
