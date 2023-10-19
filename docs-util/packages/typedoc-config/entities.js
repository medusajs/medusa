/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./base")

const pathPrefix = path.join(__dirname, "..", "..", "..")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: [path.join(pathPrefix, "packages/medusa/src/models/index.ts")],
  out: [path.join(pathPrefix, "www/apps/docs/content/references/entities")],
  tsconfig: path.join(pathPrefix, "packages/medusa/tsconfig.json"),
  name: "Entities Reference",
  indexTitle: "Entities Reference",
  entryDocument: "index.md",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  plugin: [...globalTypedocOptions.plugin, "typedoc-plugin-frontmatter"],
  frontmatterData: {
    displayed_sidebar: "entitiesSidebar",
  },
}
