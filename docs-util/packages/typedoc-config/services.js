/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./_base")

const pathPrefix = path.join(__dirname, "..", "..", "..")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: [path.join(pathPrefix, "packages/medusa/src/services/index.ts")],
  out: [path.join(pathPrefix, "www/apps/docs/content/references/services")],
  tsconfig: path.join(__dirname, "extended-tsconfig", "medusa.json"),
  name: "Services Reference",
  indexTitle: "Services Reference",
  entryDocument: "index.md",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
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
    },
  },
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
}
