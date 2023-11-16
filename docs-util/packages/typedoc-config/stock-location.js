/* eslint-disable @typescript-eslint/no-var-requires */
const modulesConfig = require("./_modules")

module.exports = modulesConfig({
  entryPointPath: "packages/types/src/stock-location/service.ts",
  outPath: "www/apps/docs/content/references/stock-location",
  moduleName: "Stock Location Module Reference",
  documentsToFormat: [
    {
      pattern: "*",
      useDefaults: true,
      additionalFormatting: {
        frontmatterData: {
          displayed_sidebar: "stockLocationReference",
        },
      },
    },
    {
      pattern: "IStockLocationService/methods",
      additionalFormatting: {
        reflectionDescription:
          "This documentation provides a reference to the `{{alias}}` {{kind}}. This belongs to the Stock Location Module.",
        frontmatterData: {
          displayed_sidebar: "stockLocationReference",
          slug: "/references/stock-location/{{alias}}",
          sidebar_label: "{{alias}}",
        },
        reflectionTitle: {
          kind: false,
          typeParameters: false,
          suffix: "- Stock Location Module Reference",
        },
      },
    },
    {
      pattern: "IStockLocationService.md",
      additionalFormatting: {
        reflectionDescription:
          "This section of the documentation provides a reference to the `IStockLocationService` interface’s methods. This is the interface developers use to use the functionalities provided by the Stock Location Module.",
        frontmatterData: {
          displayed_sidebar: "stockLocationReference",
          slug: "/references/stock-location",
        },
      },
    },
  ],
})
