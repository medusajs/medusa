/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./_base")

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
              parameterStyle: "component",
              useTsLinkResolution: false,
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
                member_sources_definedIn: false,
                member_signature_returns: false,
              },
              reflectionGroups: {
                Constructors: false,
                Properties: false,
              },
              parameterComponent: "ParameterTypes",
              mdxImports: [
                `import ParameterTypes from "@site/src/components/ParameterTypes"`,
              ],
            }
          : {
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
            }),
        ...additionalFormatting,
      }
    }
  )
  return {
    ...globalTypedocOptions,
    entryPoints: [path.join(pathPrefix, entryPointPath)],
    out: [path.join(pathPrefix, outPath)],
    tsconfig: tsconfigPath.length
      ? path.join(pathPrefix, tsconfigPath)
      : path.join(__dirname, "extended-tsconfig", "types.json"),
    name: `${moduleName} Reference`,
    indexTitle: `${moduleName} Reference`,
    entryDocument: "index.md",
    entryPointStrategy: "expand",
    hideInPageTOC: true,
    hideBreadcrumbs: true,
    plugin: [...globalTypedocOptions.plugin, "typedoc-plugin-rename-defaults"],
    formatting,
    allReflectionsHaveOwnDocument: true,
    objectLiteralTypeDeclarationStyle: "component",
    mdxOutput: true,
    ...extraOptions,
  }
}
