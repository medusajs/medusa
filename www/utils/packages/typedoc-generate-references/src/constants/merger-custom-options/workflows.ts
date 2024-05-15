import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const workflowsOptions: FormattingOptionsType = {
  "^workflows": {
    expandMembers: true,
    sections: {
      ...baseSectionsOptions,
      member_getterSetter: false,
    },
    maxLevel: 2,
  },
  "^modules/workflows/page\\.mdx": {
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
    frontmatterData: {
      slug: "/references/workflows",
    },
    reflectionTitle: {
      fullReplacement: "Workflows API Reference",
    },
  },
  "^workflows/functions": {
    maxLevel: 1,
    reflectionDescription:
      "This documentation provides a reference to the `{{alias}}` {{kind}}. It belongs to the `@medusajs/workflows-sdk` package.",
    frontmatterData: {
      slug: "/references/workflows/{{alias}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      kind: false,
      typeParameters: false,
      suffix: "- Workflows API Reference",
    },
  },
  "^workflows/.*classes/.*StepResponse": {
    reflectionGroups: {
      Properties: false,
    },
  },
  "^workflows/.*transform": {
    reflectionGroups: {
      "Type Parameters": false,
    },
  },
}

export default workflowsOptions
