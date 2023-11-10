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
    title_reflectionPath: false,
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

const classesFormattingOptions = {
  ...defaultFormattingOptions,
  frontmatterData: {
    ...defaultFormattingOptions.frontmatterData,
    slug: "/references/js-client/{{alias}}",
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
  entryDocument: "index.mdx",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  plugin: [...globalTypedocOptions.plugin, "typedoc-plugin-rename-defaults"],
  exclude: [
    ...globalTypedocOptions.exclude,
    path.join(pathPrefix, "packages/medusa-js/src/resources/base.ts"),
  ],
  internalModule: "internal",
  formatting: {
    "*": defaultFormattingOptions,
    "^classes/": classesFormattingOptions,
    AdminOrdersResource: {
      maxLevel: 2,
    },
    internal: {
      maxLevel: 1,
    },
    "internal/modules/internal": {
      reflectionGroups: {
        ...defaultFormattingOptions.reflectionGroups,
        "Type Aliases": false,
        Enumerations: false,
        Classes: false,
        Functions: false,
        Interfaces: false,
      },
    },
  },
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
  maxLevel: 4,
  ignoreApi: true,
  outputModules: false,
  outputNamespace: false,
  excludeReferences: true,
}
