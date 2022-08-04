const globalTypedocOptions = require("./typedoc")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: ["packages/medusa-js/src/resources"],
  entryPointStrategy: "expand",
  out: ["docs/content/references/js-client"],
  tsconfig: "packages/medusa-js/tsconfig.json",
  name: "JS Client Reference",
  indexTitle: "JS Client Reference",
  entryDocument: "index.md",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  plugin: [
    ...globalTypedocOptions.plugin,
    "typedoc-plugin-merge-modules",
    "typedoc-plugin-reference-excluder",
    "typedoc-monorepo-link-types",
    "typedoc-frontmatter-plugin",
  ],
  exclude: [
    "packages/medusa-js/src/resources/base.ts",
    "node_modules/**",
    "packages/**/node_modules",
  ],
  excludeConstructors: true,
  frontmatterData: {
    displayed_sidebar: "jsClientSidebar",
  },
  pagesPattern: "internal\\.",
}
