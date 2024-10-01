import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const coreFlowsOptions: FormattingOptionsType = {
  "^core_flows": {
    expandMembers: true,
    sections: {
      ...baseSectionsOptions,
      member_getterSetter: false,
    },
    workflowDiagramComponent: "WorkflowDiagram",
    mdxImports: [`import { TypeList, WorkflowDiagram } from "docs-ui"`],
  },
  "^core_flows/.*/.*Steps_.*/page\\.mdx": {
    reflectionGroups: {
      Namespaces: false,
      Enumerations: false,
      Classes: false,
      Interfaces: false,
      "Type Aliases": false,
      Variables: false,
      "Enumeration Members": false,
      Properties: false,
      "Type Literals": false,
      Functions: true,
    },
    hideTocHeaders: true,
  },
  "^core_flows/.*/.*Workflows_.*/page\\.mdx": {
    reflectionGroups: {
      Namespaces: false,
      Enumerations: false,
      Classes: false,
      Interfaces: false,
      "Type Aliases": false,
      Variables: false,
      "Enumeration Members": false,
      Properties: false,
      "Type Literals": false,
      Functions: true,
    },
    hideTocHeaders: true,
  },
  "^core_flows/.*/Workflows_.*/functions/.*/page\\.mdx": {
    reflectionDescription:
      "This documentation provides a reference to the `{{alias}}`. It belongs to the `@medusajs/medusa/core-flows` package.",
    frontmatterData: {
      slug: "/references/medusa-workflows/{{alias}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      kind: false,
      typeParameters: false,
      suffix: "- Medusa Workflows API Reference",
    },
  },
  "^core_flows/.*/Steps_.*/functions/.*/page\\.mdx": {
    reflectionDescription:
      "This documentation provides a reference to the `{{alias}}`. It belongs to the `@medusajs/medusa/core-flows` package.",
    frontmatterData: {
      slug: "/references/medusa-workflows/steps/{{alias}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      kind: false,
      typeParameters: false,
      suffix: "- Medusa Workflows API Reference",
    },
  },
}

export default coreFlowsOptions
