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
  "^modules/core_flows/page\\.mdx": {
    reflectionDescription:
      "This section of the documentation provides a reference to Medusa's workflows and steps that you can use in your customizations.",
    reflectionGroups: {
      Namespaces: true,
      Enumerations: false,
      Classes: false,
      Interfaces: false,
      "Type Aliases": false,
      Variables: false,
      "Enumeration Members": false,
      Functions: false,
    },
    hideTocHeaders: true,
    frontmatterData: {
      slug: "/references/medusa-workflows",
    },
    reflectionTitle: {
      fullReplacement: "Medusa Workflows API Reference",
    },
  },
  "^core_flows/.*/.*(Workflows|Steps)/page\\.mdx": {
    expandMembers: false,
    reflectionGroups: {
      Variables: false,
      Properties: false,
      "Type Literals": false,
    },
    sections: {
      ...baseSectionsOptions,
      member_getterSetter: false,
      members_categories: false,
    },
    hideTocHeaders: true,
  },
  "^core_flows/.*Workflows/functions/.*/page\\.mdx": {
    reflectionDescription:
      "This documentation provides a reference to the `{{alias}}`. It belongs to the `@medusajs/core-flows` package.",
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
  "^core_flows/.*Steps/functions/.*/page\\.mdx": {
    reflectionDescription:
      "This documentation provides a reference to the `{{alias}}`. It belongs to the `@medusajs/core-flows` package.",
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
