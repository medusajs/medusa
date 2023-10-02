const path = require("path")
const globalTypedocOptions = require("./typedoc")

const pathPrefix = "../.."

module.exports = {
  ...globalTypedocOptions,
  entryPoints: [path.join(pathPrefix, "packages/medusa-js/src/resources")],
  entryPointStrategy: "expand",
  out: [path.join(pathPrefix, "www/apps/docs/content/references/js-client")],
  tsconfig: path.join(pathPrefix, "packages/medusa-js/tsconfig.json"),
  name: "JS Client Reference",
  indexTitle: "JS Client Reference",
  entryDocument: "index.md",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  plugin: [
    ...globalTypedocOptions.plugin,
    "typedoc-plugin-merge-modules",
    "typedoc-plugin-reference-excluder",
    // "typedoc-monorepo-link-types",
    "typedoc-frontmatter-plugin",
  ],
  exclude: [
    path.join(pathPrefix, "packages/medusa-js/src/resources/base.ts"),
    "node_modules/**",
    "packages/**/node_modules",
  ],
  excludeConstructors: true,
  frontmatterData: {
    displayed_sidebar: "jsClientSidebar",
  },
  pagesPattern: "internal\\.",
}
