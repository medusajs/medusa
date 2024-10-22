import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const jsSdkOptions: FormattingOptionsType = {
  "^js_sdk": {
    expandMembers: true,
    expandProperties: true,
    reflectionGroups: {
      Constructors: false,
    },
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
      member_declaration_children: true,
    },
  },
  "^js_sdk/store/classes/.*Store": {
    frontmatterData: {
      slug: "/references/js-sdk/store",
    },
    reflectionDescription:
      "The `sdk.store` class provides methods to send requests to Medusa's Store API routes.",
    reflectionTitle: {
      fullReplacement: "JS SDK Store Reference",
    },
  },
  "^js_sdk/store/Store/properties/": {
    frontmatterData: {
      slug: "/references/js-sdk/admin/{{alias}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      kind: false,
      typeParameters: false,
      suffix: "- JS SDK Store Reference",
    },
    reflectionDescription:
      "This documentation provides a reference to the `sdk.store.{{alias}}` set of methods used to send requests to Medusa's Store API routes.",
  },
  "^js_sdk/admin/classes/.*Admin": {
    frontmatterData: {
      slug: "/references/js-sdk/admin",
    },
    reflectionDescription:
      "The `sdk.admin` class provides methods to send requests to Medusa's Admin API routes.",
    reflectionTitle: {
      fullReplacement: "JS SDK Admin Reference",
    },
  },
  "^js_sdk/admin/Admin/properties/": {
    frontmatterData: {
      slug: "/references/js-sdk/admin/{{alias}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      kind: false,
      typeParameters: false,
      suffix: "- JS SDK Admin Reference",
    },
    reflectionDescription:
      "This documentation provides a reference to the `sdk.admin.{{alias}}` set of methods used to send requests to Medusa's Admin API routes.",
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
      member_declaration_children: true,
      member_force_title: true,
    },
  },
  "^js_sdk/auth/classes/.*Auth": {
    frontmatterData: {
      slug: "/references/js-sdk/auth",
    },
    reflectionDescription:
      "The `sdk.auth` class provides methods to send requests to manage a user or customer's authentication",
    reflectionTitle: {
      fullReplacement: "JS SDK Auth Reference",
    },
  },
  "^js_sdk/auth/Auth/methods/": {
    frontmatterData: {
      slug: "/references/js-sdk/auth/{{alias}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      kind: false,
      typeParameters: false,
      suffix: "- JS SDK Auth Reference",
    },
    reflectionDescription:
      "This documentation provides a reference to the `sdk.auth.{{alias}}` method used to send requests to Medusa's Authentication API routes. It can be used for admin users, customers, or custom actor types.",
  },
}

export default jsSdkOptions
