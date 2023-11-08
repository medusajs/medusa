/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./_base")

const pathPrefix = path.join(__dirname, "..", "..", "..")

const defaultFormattingOptions = {
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
  frontmatterData: {
    displayed_sidebar: "jsClientSidebar",
  },
}

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  ...globalTypedocOptions,
  entryPoints: [path.join(pathPrefix, "packages/medusa-js/src/resources")],
  out: [path.join(pathPrefix, "www/apps/docs/content/references/js-client")],
  tsconfig: path.join(__dirname, "extended-tsconfig", "js-client.json"),
  name: "JS Client Reference",
  indexTitle: "JS Client Reference",
  entryDocument: "_index.mdx",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  plugin: [
    ...globalTypedocOptions.plugin,
    "typedoc-plugin-rename-defaults",
    "typedoc-plugin-custom",
  ],
  exclude: [
    path.join(pathPrefix, "packages/medusa-js/src/resources/base.ts"),
    path.join(pathPrefix, "node_modules/**"),
  ],
  internalModule: "internal",
  formatting: {
    "*": defaultFormattingOptions,
    "^classes/": {
      ...defaultFormattingOptions,
      frontmatterData: {
        ...defaultFormattingOptions.frontmatterData,
        slug: "/references/js-client/{{alias}}",
      },
    },
  },
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
  maxLevel: 4,
  ignoreApi: true,
}
