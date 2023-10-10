/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./base")

const pathPrefix = path.join(__dirname, "..", "..", "..")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: [path.join(pathPrefix, "packages/medusa/src/services/index.ts")],
  out: [path.join(pathPrefix, "www/apps/docs/content/references/services")],
  tsconfig: path.join(pathPrefix, "packages/medusa/tsconfig.json"),
  name: "Services Reference",
  indexTitle: "Services Reference",
  entryDocument: "index.md",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
}
