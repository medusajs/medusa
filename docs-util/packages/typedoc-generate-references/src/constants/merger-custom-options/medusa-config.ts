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
    reflectionDescription: `In this document, you’ll learn how to create a file service in the Medusa backend and the methods you must implement in it.

## Prerequisites

This document assumes you already followed along with the [Prepare Environment documentation](https://docs.medusajs.com/development/backend/prepare-environment) and have a Medusa backend installed.
    
---`,
    reflectionTitle: {
      fullReplacement: "Configure Medusa Backend",
    },
    expandMembers: true,
    expandProperties: true,
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
      member_declaration_children: true,
    },
  },
}

export default medusaConfigOptions
