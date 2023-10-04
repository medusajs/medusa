const path = require("path")
const globalTypedocOptions = require("./typedoc")

const pathPrefix = path.join(__dirname, "..", "..")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: [path.join(pathPrefix, "packages/product/src/services/product-module-service.ts")],
  out: [path.join(pathPrefix, "www/apps/docs/content/references/product")],
  tsconfig: path.join(pathPrefix, "packages/product/tsconfig.json"),
  name: "Product Module Reference",
  indexTitle: "Product Module Reference",
  entryDocument: "index.md",
  entryPointStrategy: "expand",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  plugin: ["typedoc-plugin-markdown-medusa", "typedoc-modules-plugin", "typedoc-plugin-rename-defaults"],
  hideMembersSymbol: true,
  formatting: {
    "ProductModuleService": {
      reflectionTitle: {
        kind: false,
        typeParameters: false
      },
      expandMembers: true,
      showCommentsAsHeader: true,
      parameterStyle: "list",
      useTsLinkResolution: false,
      showReturnSignature: false,
      sections: {
        reflection_typeParameters: false,
        member_declaration_typeParameters: false,
        reflection_implements: false,
        reflection_implementedBy: false,
        reflection_callable: false,
        reflection_indexable: false,
        member_signature_typeParameters: false,
        member_signature_sources: false,
        member_signature_title: false
      },
      reflectionGroups: {
        "Constructors": false,
        "Properties": false
      },
    }
  }
}