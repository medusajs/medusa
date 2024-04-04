import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const jsClientOptions: FormattingOptionsType = {
  "^js_client": {
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
    },
    reflectionGroups: {
      Constructors: false,
    },
    frontmatterData: {
      displayed_sidebar: "jsClientSidebar",
    },
    parameterComponentExtraProps: {
      expandUrl:
        "https://docs.medusajs.com/js-client/overview#expanding-fields",
    },
    maxLevel: 4,
  },
  "^js_client/classes/": {
    frontmatterData: {
      displayed_sidebar: "jsClientSidebar",
      slug: "/references/js-client/{{alias}}",
    },
  },
  "^js_client/.*AdminOrdersResource": {
    maxLevel: 2,
  },
  "^js_client/.*LineItemsResource": {
    maxLevel: 3,
  },
}

export default jsClientOptions
