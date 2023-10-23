/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./base")

const pathPrefix = path.join(__dirname, "..", "..", "..")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: [path.join(pathPrefix, "packages/medusa-js/src/resources")],
  entryPointStrategy: "expand",
  out: [path.join(pathPrefix, "www/apps/docs/content/references/js-client")],
  tsconfig: path.join(pathPrefix, "packages/medusa-js/tsconfig.json"),
  name: "JS Client Reference",
  indexTitle: "JS Client Reference",
  entryDocument: "_index.mdx",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  plugin: [
    "typedoc-plugin-markdown-medusa",
    "typedoc-plugin-reference-excluder",
    "typedoc-plugin-frontmatter",
    "typedoc-plugin-rename-defaults",
    "typedoc-plugin-modules",
  ],
  exclude: [
    path.join(pathPrefix, "packages/medusa-js/src/resources/base.ts"),
    path.join(pathPrefix, "node_modules/**"),
    path.join(pathPrefix, "packages/**/node_modules"),
  ],
  excludeConstructors: true,
  frontmatterData: {
    displayed_sidebar: "jsClientSidebar",
  },
  internalModule: "internal",
  formatting: {
    "*": {
      showCommentsAsHeader: true,
      sections: {
        member_sources_definedIn: false,
        reflection_hierarchy: false,
      },
      parameterStyle: "component",
      parameterComponent: "ParameterTypes",
      mdxImports: [
        `import ParameterTypes from "@site/src/components/ParameterTypes"`,
      ],
    },
  },
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
}
