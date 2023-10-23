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
  entryDocument: "_index.mdx",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  plugin: ["typedoc-plugin-markdown-medusa", "typedoc-plugin-frontmatter"],
  frontmatterData: {
    displayed_sidebar: "entitiesSidebar",
  },
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
      reflectionGroups: {
        Constructors: false,
        Methods: false,
      },
    },
  },
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
}
