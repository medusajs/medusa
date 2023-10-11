/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./base")

const pathPrefix = path.join(__dirname, "..", "..", "..")

module.exports = ({
  entryPointPath,
  outPath,
  tsconfigPath = "",
  moduleName = "",
  documentsToFormat = [],
  extraOptions = {},
}) => {
  const formatting = {}
  documentsToFormat.forEach(
    ({ pattern, additionalFormatting, useDefaults = false }) => {
      formatting[pattern] = {
        ...(!useDefaults
          ? {
              reflectionTitle: {
                kind: false,
                typeParameters: false,
                suffix: "Reference",
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
                member_signature_title: false,
                title_reflectionPath: false,
              },
              reflectionGroups: {
                Constructors: false,
                Properties: false,
              },
            }
          : {}),
        ...additionalFormatting,
      }
    }
  )
  return {
    ...globalTypedocOptions,
    entryPoints: [path.join(pathPrefix, entryPointPath)],
    out: [path.join(pathPrefix, outPath)],
    tsconfig: path.join(
      pathPrefix,
      tsconfigPath || "packages/types/tsconfig.json"
    ),
    name: `${moduleName} Reference`,
    indexTitle: `${moduleName} Reference`,
    entryDocument: "index.md",
    entryPointStrategy: "expand",
    hideInPageTOC: true,
    hideBreadcrumbs: true,
    plugin: [
      "typedoc-plugin-markdown-medusa",
      "typedoc-plugin-modules",
      "typedoc-plugin-rename-defaults",
      "typedoc-plugin-frontmatter",
    ],
    hideMembersSymbol: true,
    formatting,
    allReflectionsHaveOwnDocument: true,
    ...extraOptions,
  }
}
