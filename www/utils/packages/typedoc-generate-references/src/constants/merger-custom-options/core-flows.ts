import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const coreFlowsOptions: FormattingOptionsType = {
  "^core_flows": {
    expandMembers: true,
    sections: {
      ...baseSectionsOptions,
      member_getterSetter: false,
    },
    maxLevel: 2,
    workflowDiagramComponent: "WorkflowDiagram",
    mdxImports: [
      `import { TypeList } from "docs-ui"`,
      `import { WorkflowDiagram } from "docs-ui"`,
    ],
  },
  "^modules/core_flows/page\\.mdx": {
    reflectionDescription:
      "This section of the documentation provides a reference to Medusa's workflows and steps that you can use in your customizations.",
    reflectionGroups: {
      Namespaces: false,
      Enumerations: false,
      Classes: false,
      Interfaces: false,
      "Type Aliases": false,
      Variables: false,
      "Enumeration Members": false,
    },
    frontmatterData: {
      slug: "/references/medusa-workflows",
    },
    reflectionTitle: {
      fullReplacement: "Medusa Workflows API Reference",
    },
  },
  "^core_flows/functions/.*Workflow/page\\.mdx": {
    maxLevel: 1,
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
  "^core_flows/functions/.*Step/page\\.mdx": {
    maxLevel: 1,
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
