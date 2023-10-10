/* eslint-disable @typescript-eslint/no-var-requires */
const modulesConfig = require("./modules")

module.exports = modulesConfig({
  entryPointPath: "packages/types/src/pricing/service.ts",
  outPath: "www/apps/docs/content/references/pricing",
  moduleName: "Pricing Module Reference",
  documentsToFormat: ["IPricingModuleService"],
  additionalFormatting: {
    reflectionDescription:
      "This document provides a reference to the `IPricingModuleService` interface’s methods. This is the interface developers use to use the functionalities provided by the Pricing Module.",
  },
  extraOptions: {
    frontmatterData: {
      displayed_sidebar: "modules",
    },
  },
})
