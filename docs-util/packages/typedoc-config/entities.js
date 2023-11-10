/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./_base")

const pathPrefix = path.join(__dirname, "..", "..", "..")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: [path.join(pathPrefix, "packages/medusa/src/models/index.ts")],
  out: [path.join(pathPrefix, "www/apps/docs/content/references/entities")],
  tsconfig: path.join(__dirname, "extended-tsconfig", "medusa.json"),
  name: "Entities Reference",
  indexTitle: "Entities Reference",
  entryDocument: "index.mdx",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
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
      frontmatterData: {
        displayed_sidebar: "entitiesSidebar",
      },
    },
    "(Order|Swap|Cart|LineItem)": {
      maxLevel: 1,
    },
  },
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
  maxLevel: 2,
}
