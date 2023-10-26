import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"

export const InventoryLevelStockLocation: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  /* databaseConfig: {
    tableName: "inventory_level",
    idPrefix: "pvitem",
    extraFields: {
      required_quantity: {
        type: "integer",
        defaultValue: "1",
      },
    },
  },
  alias: [
    {
      name: "inventory_level_stock_location",
    },
    {
      name: "inventory_level_stock_locations",
    },
  ],
  primaryKeys: ["id", "inventory_item_id", "stock_location_id"],
  relationships: [
    {
      serviceName: Modules.INVENTORY,
      primaryKey: "id",
      foreignKey: "inventory_level_id",
      alias: "inventory_level",
      args: {
        methodSuffix: "InventoryLevel",
      },
    },
    {
      serviceName: Modules.STOCK_LOCATION,
      primaryKey: "id",
      foreignKey: "stock_location_id",
      alias: "stock_location",
      deleteCascade: true,
    },
  ],*/
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
    /*{
      serviceName: Modules.STOCK_LOCATION,
      relationship: {
        serviceName: Modules.INVENTORY,
        primaryKey: "id",
        foreignKey: "inventory_level_id",
        alias: "inventory_level_link",
        isList: true,
      },
    },*/
  ],
}
