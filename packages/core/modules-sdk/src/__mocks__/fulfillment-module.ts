export const FulfillmentModule = {
  __definition: {
    key: "fulfillmentService",
    registrationName: "fulfillmentService",
    defaultPackage: false,
    label: "FulfillmentService",
    isRequired: false,
    isQueryable: true,
    defaultModuleDeclaration: {
      scope: "internal",
    },
  },
  __joinerConfig: {
    serviceName: "fulfillmentService",
    primaryKeys: ["id"],
    linkableKeys: { fulfillment_set_id: "FulfillmentSet" },
    alias: [],
  },

  list: jest.fn(async () => []),
  softDelete: jest.fn(() => {}),
}
