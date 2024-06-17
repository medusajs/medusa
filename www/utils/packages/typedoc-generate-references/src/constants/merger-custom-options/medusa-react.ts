import { FormattingOptionsType } from "types"

const medusaReactOptions: FormattingOptionsType = {
  "^medusa_react": {
    parameterComponentExtraProps: {
      expandUrl:
        "https://docs.medusajs.com/medusa-react/overview#expanding-fields",
    },
  },
  "^modules/medusa_react\\.mdx": {
    reflectionGroups: {
      Variables: false,
      Functions: false,
    },
    reflectionCategories: {
      Mutations: false,
      Queries: false,
      Other: false,
    },
  },
  "^medusa_react/(medusa_react\\.Hooks|.*medusa_react\\.Hooks\\.Admin|.*medusa_react\\.Hooks\\.Store|medusa_react\\.Providers)/page\\.mdx":
    {
      reflectionGroups: {
        Functions: false,
      },
    },
  "^medusa_react/Providers/.*": {
    expandMembers: true,
    frontmatterData: {
      slug: "/references/medusa-react/providers/{{alias-lower}}",
      sidebar_label: "{{alias}}",
    },
    reflectionTitle: {
      suffix: " Provider Overview",
    },
  },
  "^medusa_react/medusa_react\\.Utilities": {
    expandMembers: true,
    reflectionTitle: {
      prefix: "Medusa React ",
    },
  },
  "^medusa_react/Utilities/.*": {
    expandMembers: true,
    frontmatterData: {
      slug: "/references/medusa-react/utilities/{{alias}}",
    },
  },
  "^medusa_react/medusa_react\\.Hooks/page\\.mdx": {
    frontmatterData: {
      slug: "/references/medusa-react/hooks",
    },
  },
  "^medusa_react/Hooks/Admin/.*Admin/page\\.mdx": {
    frontmatterData: {
      slug: "/references/medusa-react/hooks/admin",
    },
  },
  "^medusa_react/Hooks/Admin/.*": {
    frontmatterData: {
      slug: "/references/medusa-react/hooks/admin/{{alias-lower}}",
    },
  },
  "^medusa_react/Hooks/Store/.*Store/page\\.mdx": {
    frontmatterData: {
      slug: "/references/medusa-react/hooks/store",
    },
  },
  "^medusa_react/Hooks/Store/.*": {
    frontmatterData: {
      slug: "/references/medusa-react/hooks/store/{{alias-lower}}",
    },
  },
  "^medusa_react/medusa_react\\.Providers/page\\.mdx": {
    frontmatterData: {
      slug: "/references/medusa-react/providers",
    },
  },
  "^medusa_react/medusa_react\\.Utilities/page\\.mdx": {
    frontmatterData: {
      slug: "/references/medusa-react/utilities",
    },
  },
  "^medusa_react/Hooks/.*Admin\\.Inventory_Items": {
    maxLevel: 4,
  },
  "^medusa_react/Hooks/.*Admin\\.Products": {
    maxLevel: 4,
  },
  "^medusa_react/Hooks/.*Admin\\.Stock_Locations": {
    maxLevel: 5,
  },
  "^medusa_react/Hooks/.*Admin\\.Users": {
    maxLevel: 5,
  },
}

export default medusaReactOptions
