import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const dmlOptions: FormattingOptionsType = {
  "^dml": {
    expandMembers: true,
    sections: {
      ...baseSectionsOptions,
      member_getterSetter: false,
    },
    // maxLevel: 2,
  },
  "^modules/dml/page\\.mdx": {
    reflectionDescription:
      "This section of the documentation provides an API reference to the property types and methods used to create a data model.",
    // reflectionGroups: {
    //   Namespaces: false,
    //   Enumerations: false,
    //   Classes: false,
    //   Interfaces: false,
    //   "Type Aliases": false,
    //   Variables: false,
    //   "Enumeration Members": false,
    // },
    frontmatterData: {
      slug: "/references/data-model",
    },
    reflectionTitle: {
      fullReplacement: "Data Models API Reference",
    },
  },
}

export default dmlOptions
