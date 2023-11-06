/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./_base")

const pathPrefix = path.join(__dirname, "..", "..", "..")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: [path.join(pathPrefix, "packages/medusa-js/src/resources")],
  // entryPointStrategy: "expand",
  out: [path.join(pathPrefix, "www/apps/docs/content/references/js-client")],
  tsconfig: path.join(pathPrefix, "packages/medusa-js/tsconfig.json"),
  name: "JS Client Reference",
  indexTitle: "JS Client Reference",
  entryDocument: "_index.mdx",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  plugin: [
    ...globalTypedocOptions.plugin,
    // "typedoc-plugin-reference-excluder",
    // "typedoc-plugin-frontmatter",
    "typedoc-plugin-rename-defaults",
    "typedoc-plugin-custom",
  ],
  exclude: [
    path.join(pathPrefix, "packages/medusa-js/src/resources/base.ts"),
    path.join(pathPrefix, "node_modules/**"),
    // path.join(pathPrefix, "packages/**/node_modules"),
    // `!${path.join(pathPrefix, "packages/**/node_modules/@medusajs")}`,
  ],
  // excludeConstructors: true,
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
        member_signature_typeParameters: false,
        member_signature_sources: false,
        member_signature_title: false,
        member_signature_returns: false,
      },
      parameterStyle: "component",
      parameterComponent: "ParameterTypes",
      mdxImports: [
        `import ParameterTypes from "@site/src/components/ParameterTypes"`,
      ],
      reflectionGroups: {
        Constructors: false,
      },
    },
  },
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
  maxLevel: 4,
}
