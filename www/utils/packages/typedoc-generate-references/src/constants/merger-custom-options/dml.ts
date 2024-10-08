import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const dmlOptions: FormattingOptionsType = {
  "^dml": {
    expandMembers: true,
    sections: {
      ...baseSectionsOptions,
      member_getterSetter: false,
      member_returns: false,
    },
  },
  "^modules/dml/page\\.mdx": {
    reflectionDescription:
      "This section of the documentation provides an API reference to the property types and methods used to create a data model.",
    reflectionGroups: {
      Classes: false,
      Variables: false,
      Properties: false,
      Modules: false,
    },
    frontmatterData: {
      slug: "/references/data-model",
    },
    reflectionTitle: {
      fullReplacement: "Data Models API Reference",
    },
    hideTocHeaders: true,
  },
  "^dml/.*define": {
    frontmatterData: {
      slug: "/references/data-model/define",
    },
    reflectionTitle: {
      suffix: "Method - API Reference",
    },
  },
  "^dml/.*Property_Types/page\\.mdx": {
    frontmatterData: {
      slug: "/references/data-model/property-types",
    },
    reflectionDescription:
      "The following methods are used to define the type of a property in a data model.",
    reflectionTitle: {
      suffix: "- API Reference",
    },
  },
  "^dml/Property_Types": {
    frontmatterData: {
      slug: "/references/data-model/property-types/{{alias-lower}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      suffix: "Property Method - API Reference",
    },
  },
  "^dml/.*Relationship_Methods/page\\.mdx": {
    frontmatterData: {
      slug: "/references/data-model/relationship-methods",
    },
    reflectionDescription:
      "The following methods are used to define a relationship between two data models.",
    reflectionTitle: {
      suffix: "- API Reference",
    },
  },
  "^dml/Relationship_Methods": {
    frontmatterData: {
      slug: "/references/data-model/relationship-methods/{{alias-lower}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      suffix: "Relationship Method - API Reference",
    },
  },
  "^dml/.*Model_Methods/page\\.mdx": {
    frontmatterData: {
      slug: "/references/data-model/model-methods",
    },
    reflectionDescription:
      "The following methods are used on a module to configure it.",
    reflectionTitle: {
      suffix: "- API Reference",
    },
  },
  "^dml/Model_Methods": {
    frontmatterData: {
      slug: "/references/data-model/model-methods/{{alias-lower}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      suffix: "Method - API Reference",
    },
  },
  "^dml/.*Property_Configuration_Methods/page\\.mdx": {
    frontmatterData: {
      slug: "/references/data-model/property-configuration",
    },
    reflectionDescription:
      "The following methods are used on a property to configure it.",
    reflectionTitle: {
      suffix: "- API Reference",
    },
  },
  "^dml/Property_Configuration_Methods": {
    frontmatterData: {
      slug: "/references/data-model/property-configuration/{{alias-lower}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      suffix: "Method - API Reference",
    },
  },
  "^dml/.*/types/.*": {
    sections: {
      ...baseSectionsOptions,
      member_getterSetter: false,
      member_returns: false,
      member_declaration_children: true,
    },
  },
}

export default dmlOptions
