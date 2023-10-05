/* eslint-disable @typescript-eslint/no-var-requires */
const modulesConfig = require("./modules")

module.exports = modulesConfig({
  entryPointPath: "packages/types/src/pricing/service.ts",
  outPath: "www/apps/docs/content/reference/pricing",
  moduleName: "Pricing Module Reference",
  documentsToFormat: ["IPricingModuleService"],
  extraOptions: {
    frontmatterData: {
      displayed_sidebar: "modules",
    },
  },
})
