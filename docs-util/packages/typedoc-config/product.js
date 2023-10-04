/* eslint-disable @typescript-eslint/no-var-requires */
const modulesConfig = require("./modules")

module.exports = modulesConfig({
  entryPointPath: "packages/types/src/product/service.ts",
  outPath: "www/apps/docs/content/references/product",
  moduleName: "Product Module",
  documentsToFormat: ["IProductModuleService"],
  additionalFormatting: {
    reflectionDescription:
      "This document provides a reference to the `IProductModuleService` interface’s methods. This is the interface developers use to use the functionalities provided by the Product Module.",
  },
  extraOptions: {
    frontmatterData: {
      displayed_sidebar: "modules",
    },
  },
})
