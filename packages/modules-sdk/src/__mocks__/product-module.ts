export const ProductModule = {
  __definition: {
    key: "productService",
    registrationName: "productModuleService",
    defaultPackage: false,
    label: "ProductModuleService",
    isRequired: false,
    canOverride: true,
    isQueryable: true,
    dependencies: ["eventBusModuleService"],
    defaultModuleDeclaration: {
      scope: "internal",
      resources: "shared",
    },
  },
  __joinerConfig: {
    serviceName: "productService",
    primaryKeys: ["id", "handle"],
    linkableKeys: ["product_id", "variant_id"],
    alias: [],
  },

  delete: jest.fn((ids) => {
    return {
      product_id: ids,
    }
  }),
}
