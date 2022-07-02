const globalTypedocOptions = require("./typedoc")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: ["packages/medusa/src/services/index.ts"],
  out: ["docs/content/references/services"],
  tsconfig: "packages/medusa/tsconfig.json",
  name: "Services Reference",
  indexTitle: "Services Reference",
  entryDocument: "index.md",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
}
