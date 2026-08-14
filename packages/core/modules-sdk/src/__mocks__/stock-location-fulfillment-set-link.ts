export const StockLocationFulfillmentSetLink = {
  __definition: {
    key: "locationFulfillmentSetLink",
    registrationName: "locationFulfillmentSetLink",
    defaultPackage: "",
    label: "locationFulfillmentSetLink",
    isRequired: false,
    isQueryable: true,
    defaultModuleDeclaration: {
      scope: "internal",
    },
  },
  __joinerConfig: {
    serviceName: "locationFulfillmentSetLink",
    isLink: true,
    alias: [
      {
        name: "location_fulfillment_set",
      },
      {
        name: "location_fulfillment_sets",
      },
    ],
    primaryKeys: ["stock_location_id", "fulfillment_set_id"],
    relationships: [
      {
        serviceName: "stockLocationService",
        primaryKey: "id",
        foreignKey: "stock_location_id",
        alias: "location",
        args: {},
      },
      {
        serviceName: "fulfillmentService",
        primaryKey: "id",
        foreignKey: "fulfillment_set_id",
        alias: "fulfillment_set",
        deleteCascade: true,
        hasMany: true,
      },
    ],
    extends: [
      {
        serviceName: "stockLocationService",
        relationship: {
          serviceName: "locationFulfillmentSetLink",
          primaryKey: "stock_location_id",
          foreignKey: "id",
          alias: "fulfillment_set_link",
          isList: true,
        },
      },
      {
        serviceName: "fulfillmentService",
        relationship: {
          serviceName: "locationFulfillmentSetLink",
          primaryKey: "fulfillment_set_id",
          foreignKey: "id",
          alias: "locations_link",
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
  list: jest.fn(async () => []),
  softDelete: jest.fn(() => {}),
}
