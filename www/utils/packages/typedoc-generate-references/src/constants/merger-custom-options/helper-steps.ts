import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const helperStepsOptions: FormattingOptionsType = {
  "^helper_steps": {
    expandMembers: true,
    sections: {
      ...baseSectionsOptions,
      member_getterSetter: false,
    },
    maxLevel: 2,
  },
  "^modules/helper_steps/page\\.mdx": {
    reflectionDescription:
      "This section of the documentation provides a reference to utility steps that you can use in your workflows. These steps are imported from the `@medusajs/core-flows` package.",
    reflectionGroups: {
      Namespaces: false,
      Enumerations: false,
      Classes: false,
      Interfaces: false,
      "Type Aliases": false,
      Variables: false,
      "Enumeration Members": false,
      Functions: true,
    },
    frontmatterData: {
      slug: "/references/helper-steps",
    },
    reflectionTitle: {
      fullReplacement: "Helper Steps API Reference",
    },
    reflectionGroupRename: {
      Functions: "Steps",
    },
  },
  "^helper_steps/functions": {
    reflectionDescription:
      "This documentation provides a reference to the `{{alias}}` step. It belongs to the `@medusajs/core-flows` package.",
    frontmatterData: {
      slug: "/references/helper-steps/{{alias}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      kind: false,
      typeParameters: false,
      suffix: "- Helper Steps API Reference",
    },
  },
}

export default helperStepsOptions
