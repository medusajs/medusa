export const InventoryStockLocationLink = {
  __definition: {
    key: "inventoryStockLocationLink",
    registrationName: "inventoryStockLocationLink",
    defaultPackage: "",
    label: "inventoryStockLocationLink",
    isRequired: false,
    isQueryable: true,
    defaultModuleDeclaration: {
      scope: "internal",
      resources: "shared",
    },
  },
  __joinerConfig: {
    serviceName: "inventoryStockLocationLink",
    isLink: true,
    alias: [
      {
        name: "inventory_level_stock_location",
      },
      {
        name: "inventory_level_stock_locations",
      },
    ],
    primaryKeys: ["inventory_level_id", "stock_location_id"],
    relationships: [
      {
        serviceName: "inventoryService",
        primaryKey: "id",
        foreignKey: "inventory_level_id",
        alias: "inventory_level",
        args: {},
      },
      {
        serviceName: "stockLocationService",
        primaryKey: "id",
        foreignKey: "stock_location_id",
        alias: "stock_location",
      },
    ],
    extends: [
      {
        serviceName: "inventoryService",
        relationship: {
          serviceName: "inventoryStockLocationLink",
          primaryKey: "inventory_level_id",
          foreignKey: "id",
          alias: "inventory_location_items",
        },
      },
      {
        serviceName: "stockLocationService",
        relationship: {
          serviceName: "inventoryStockLocationLink",
          primaryKey: "stock_location_id",
          foreignKey: "id",
          alias: "inventory_location_items",
        },
      },
    ],
  },

  create: jest.fn(
    async (
      primaryKeyOrBulkData: string | string[] | [string | string[], string][],
      foreignKeyData?: string
    ) => {}
  ),
  softDelete: jest.fn(() => {}),
}
