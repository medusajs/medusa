/* eslint-disable @typescript-eslint/no-var-requires */
const modulesConfig = require("./_modules")

module.exports = modulesConfig({
  entryPointPath: "packages/types/src/product/service.ts",
  outPath: "www/apps/docs/content/references/product",
  moduleName: "Product Module Reference",
  documentsToFormat: [
    {
      pattern: "*",
      useDefaults: true,
      additionalFormatting: {
        frontmatterData: {
          displayed_sidebar: "productReference",
        },
      },
    },
    {
      pattern: "IProductModuleService/methods",
      additionalFormatting: {
        reflectionDescription:
          "This documentation provides a reference to the {{alias}} {{kind}}. This belongs to the Product Module.",
        frontmatterData: {
          displayed_sidebar: "productReference",
          badge: {
            variant: "orange",
            text: "Beta",
          },
          slug: "/references/product/{{alias}}",
          sidebar_label: "{{alias}}",
        },
        reflectionTitle: {
          kind: false,
          typeParameters: false,
          suffix: "- Product Module Reference",
        },
      },
    },
    {
      pattern: "IProductModuleService.md",
      additionalFormatting: {
        reflectionDescription:
          "This section of the documentation provides a reference to the `IProductModuleService` interface’s methods. This is the interface developers use to use the functionalities provided by the Product Module.",
        frontmatterData: {
          displayed_sidebar: "productReference",
          badge: {
            variant: "orange",
            text: "Beta",
          },
          slug: "/references/product",
        },
      },
    },
  ],
})
