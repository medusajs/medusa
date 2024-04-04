import { FormattingOptionsType } from "types"

const medusaReactOptions: FormattingOptionsType = {
  "^medusa_react": {
    frontmatterData: {
      displayed_sidebar: "medusaReactSidebar",
    },
    parameterComponentExtraProps: {
      expandUrl:
        "https://docs.medusajs.com/medusa-react/overview#expanding-fields",
    },
  },
  "^modules/medusa_react\\.mdx": {
    frontmatterData: {
      displayed_sidebar: "medusaReactSidebar",
    },
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
  "^medusa_react/(medusa_react\\.Hooks\\.mdx|.*medusa_react\\.Hooks\\.Admin\\.mdx|.*medusa_react\\.Hooks\\.Store\\.mdx|medusa_react\\.Providers\\.mdx)":
    {
      reflectionGroups: {
        Functions: false,
      },
    },
  "^medusa_react/Providers/.*": {
    expandMembers: true,
    frontmatterData: {
      displayed_sidebar: "medusaReactSidebar",
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
      displayed_sidebar: "medusaReactSidebar",
      slug: "/references/medusa-react/utilities/{{alias}}",
    },
  },
  "^medusa_react/medusa_react\\.Hooks\\.mdx": {
    frontmatterData: {
      displayed_sidebar: "medusaReactSidebar",
      slug: "/references/medusa-react/hooks",
    },
  },
  "^medusa_react/Hooks/Admin/.*Admin\\.mdx": {
    frontmatterData: {
      displayed_sidebar: "medusaReactSidebar",
      slug: "/references/medusa-react/hooks/admin",
    },
  },
  "^medusa_react/Hooks/Admin/.*": {
    frontmatterData: {
      displayed_sidebar: "medusaReactSidebar",
      slug: "/references/medusa-react/hooks/admin/{{alias-lower}}",
    },
  },
  "^medusa_react/Hooks/Store/.*Store\\.mdx": {
    frontmatterData: {
      displayed_sidebar: "medusaReactSidebar",
      slug: "/references/medusa-react/hooks/store",
    },
  },
  "^medusa_react/Hooks/Store/.*": {
    frontmatterData: {
      displayed_sidebar: "medusaReactSidebar",
      slug: "/references/medusa-react/hooks/store/{{alias-lower}}",
    },
  },
  "^medusa_react/medusa_react\\.Providers\\.mdx": {
    frontmatterData: {
      displayed_sidebar: "medusaReactSidebar",
      slug: "/references/medusa-react/providers",
    },
  },
  "^medusa_react/medusa_react\\.Utilities\\.mdx": {
    frontmatterData: {
      displayed_sidebar: "medusaReactSidebar",
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
