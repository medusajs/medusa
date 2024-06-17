import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const medusaConfigOptions: FormattingOptionsType = {
  "^medusa_config": {
    expandMembers: true,
  },
  "^medusa_config/.*ConfigModule": {
    frontmatterData: {
      slug: "/references/medusa-config",
    },
    reflectionDescription: `In this document, you’ll learn how to create a file service in the Medusa backend and the methods you must implement in it.`,
    reflectionTitle: {
      fullReplacement: "Configure Medusa Backend",
    },
    expandMembers: true,
    expandProperties: true,
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
      member_declaration_children: true,
      member_declaration_typeDeclaration: false,
      member_declaration_signatures: false,
    },
  },
}

export default medusaConfigOptions
