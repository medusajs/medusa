export const InventoryStockLocationLink = {
  __definition: {
    key: "inventoryStockLocationLink",
    registrationName: "inventoryStockLocationLink",
    defaultPackage: "",
    label: "inventoryStockLocationLink",
    canOverride: true,
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
        name: "inventory_item_stock_location",
      },
      {
        name: "inventory_item_stock_locations",
      },
    ],
    primaryKeys: ["inventory_item_id", "stock_location_id"],
    relationships: [
      {
        serviceName: "inventoryService",
        primaryKey: "id",
        foreignKey: "inventory_item_id",
        alias: "inventory_item",
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
          primaryKey: "inventory_item_id",
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
  delete: jest.fn(() => {}),
}
