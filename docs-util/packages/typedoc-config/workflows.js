/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./_base")

const pathPrefix = path.join(__dirname, "..", "..", "..")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: [
    path.join(pathPrefix, "packages/workflows-sdk/src/utils/composer/index.ts"),
  ],
  out: [path.join(pathPrefix, "www/apps/docs/content/references/workflows")],
  tsconfig: path.join(__dirname, "extended-tsconfig", "workflows.json"),
  name: "Workflows API Reference",
  indexTitle: "Workflows API Reference",
  entryDocument: "index.mdx",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  formatting: {
    "*": {
      expandMembers: true,
      showCommentsAsHeader: true,
      sections: {
        member_sources_definedIn: false,
        reflection_hierarchy: false,
        member_sources_inheritedFrom: false,
        member_sources_implementationOf: false,
        reflection_implementedBy: false,
        member_signature_sources: false,
        reflection_callable: false,
        reflection_indexable: false,
        member_signature_title: false,
        member_signature_returns: false,
        member_getterSetter: false,
      },
      parameterStyle: "component",
      parameterComponent: "ParameterTypes",
      mdxImports: [
        `import ParameterTypes from "@site/src/components/ParameterTypes"`,
      ],
      frontmatterData: {
        displayed_sidebar: "workflowsSidebar",
      },
    },
    "index\\.mdx": {
      reflectionDescription:
        "This section of the documentation provides a reference to the utility functions of the `@medusajs/workflows-sdk` package.",
      reflectionGroups: {
        Namespaces: false,
        Enumerations: false,
        Classes: false,
        Interfaces: false,
        "Type Aliases": false,
        Variables: false,
        "Enumeration Members": false,
      },
    },
    functions: {
      maxLevel: 1,
      reflectionDescription:
        "This documentation provides a reference to the `{{alias}}` {{kind}}. It belongs to the `@medusajs/workflows-sdk` package.",
      frontmatterData: {
        displayed_sidebar: "workflowsSidebar",
        slug: "/references/workflows/{{alias}}",
        sidebar_label: "{{alias}}",
      },
      reflectionTitle: {
        kind: false,
        typeParameters: false,
        suffix: "- Workflows Reference",
      },
    },
    "classes/StepResponse": {
      reflectionGroups: {
        Properties: false,
      },
    },
    transform: {
      reflectionGroups: {
        "Type Parameters": false,
      },
    },
  },
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
  maxLevel: 2,
  allReflectionsHaveOwnDocument: true,
  excludeExternals: true,
}
