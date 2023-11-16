/* eslint-disable @typescript-eslint/no-var-requires */
const modulesConfig = require("./_modules")

module.exports = modulesConfig({
  entryPointPath: "packages/types/src/inventory/service.ts",
  outPath: "www/apps/docs/content/references/inventory",
  moduleName: "Inventory Module Reference",
  documentsToFormat: [
    {
      pattern: "*",
      useDefaults: true,
      additionalFormatting: {
        frontmatterData: {
          displayed_sidebar: "inventoryReference",
        },
      },
    },
    {
      pattern: "IInventoryService/methods",
      additionalFormatting: {
        reflectionDescription:
          "This documentation provides a reference to the `{{alias}}` {{kind}}. This belongs to the Inventory Module.",
        frontmatterData: {
          displayed_sidebar: "inventoryReference",
          slug: "/references/inventory/{{alias}}",
          sidebar_label: "{{alias}}",
        },
        reflectionTitle: {
          kind: false,
          typeParameters: false,
          suffix: "- Inventory Module Reference",
        },
      },
    },
    {
      pattern: "IInventoryService.md",
      additionalFormatting: {
        reflectionDescription:
          "This section of the documentation provides a reference to the `IInventoryService` interface’s methods. This is the interface developers use to use the functionalities provided by the Inventory Module.",
        frontmatterData: {
          displayed_sidebar: "inventoryReference",
          slug: "/references/inventory",
        },
      },
    },
  ],
})
