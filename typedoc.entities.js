const globalTypedocOptions = require("./typedoc")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: ["packages/medusa/src/models/index.ts"],
  out: ["docs/content/references/entities"],
  tsconfig: "packages/medusa/tsconfig.json",
  name: "Entities Reference",
  indexTitle: "Entities Reference",
  entryDocument: "index.md",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  plugin: [...globalTypedocOptions.plugin, "typedoc-frontmatter-plugin"],
  frontmatterData: {
    displayed_sidebar: "entitiesSidebar",
  },
}
