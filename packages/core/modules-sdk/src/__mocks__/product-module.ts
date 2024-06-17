export const ProductModule = {
  __definition: {
    key: "productService",
    registrationName: "productModuleService",
    defaultPackage: false,
    label: "ProductModuleService",
    isRequired: false,
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
    linkableKeys: { product_id: "Product", variant_id: "ProductVariant" },
    alias: [],
  },

  softDelete: jest.fn(() => {}),
}
