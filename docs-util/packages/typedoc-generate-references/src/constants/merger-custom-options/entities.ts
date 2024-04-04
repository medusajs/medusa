import { FormattingOptionsType } from "types"

const entitiesOptions: FormattingOptionsType = {
  "^entities": {
    reflectionGroups: {
      Constructors: false,
      Methods: false,
    },
    frontmatterData: {
      displayed_sidebar: "entitiesSidebar",
    },
    maxLevel: 2,
    parameterComponentExtraProps: {
      expandUrl:
        "https://docs.medusajs.com/development/entities/repositories#retrieving-a-list-of-records",
    },
  },
  "^entities/classes": {
    frontmatterData: {
      displayed_sidebar: "entitiesSidebar",
      slug: "/references/entities/classes/{{alias}}",
    },
  },
  "^entities/.*(Order|Swap|Cart|LineItem)": {
    maxLevel: 1,
  },
}

export default entitiesOptions
