export const InventoryModule = {
  __definition: {
    key: "inventoryService",
    registrationName: "inventoryService",
    defaultPackage: false,
    label: "InventoryService",
    isRequired: false,
    canOverride: true,
    isQueryable: true,
    dependencies: [],
    defaultModuleDeclaration: {
      scope: "internal",
      resources: "shared",
    },
  },
  __joinerConfig: {
    serviceName: "inventoryService",
    primaryKeys: ["id"],
    linkableKeys: [
      "inventory_item_id",
      "inventory_level_id",
      "reservation_item_id",
    ],
  },

  softDelete: jest.fn(() => {}),
}
