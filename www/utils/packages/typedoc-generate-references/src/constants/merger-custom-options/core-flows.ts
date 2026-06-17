import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"
import { getEnterpriseNotice } from "../../utils/enterprise.js"

const rbacEnterpriseNotice = getEnterpriseNotice("rbac")
const baseSections = {
  ...baseSectionsOptions,
  member_getterSetter: false,
}

const coreFlowsOptions: FormattingOptionsType = {
  "^core_flows": {
    expandMembers: true,
    sections: baseSections,
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
      sidebar_description: "{{summary}}",
    },
    reflectionTitle: {
      kind: false,
      typeParameters: false,
      suffix: "- Medusa Core Workflows Reference",
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
      suffix: "- Medusa Core Workflows Reference",
    },
  },
  "^core_flows/(Order|Draft_Order)/.*": {
    maxLevel: 2,
  },
  "^core_flows/Rbac/Workflows_Rbac/.*/page\\.mdx": {
    reflectionDescription:
      `${rbacEnterpriseNotice}This documentation provides a reference to the \`{{alias}}\`. It belongs to the \`@medusajs/medusa/core-flows\` package.`,
    sections: {
      ...baseSections,
      feature_flag: false,
    }
  },
  "^core_flows/Rbac/Steps_Rbac/.*/page\\.mdx": {
    reflectionDescription:
      `${rbacEnterpriseNotice}This documentation provides a reference to the \`{{alias}}\`. It belongs to the \`@medusajs/medusa/core-flows\` package.`,
    sections: {
      ...baseSections,
      feature_flag: false,
    }
  },
}

export default coreFlowsOptions
