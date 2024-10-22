import { OptionType } from "@/hooks"
import { NavigationItem } from "types"

export const GITHUB_ISSUES_PREFIX = `https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml`
export const GITHUB_UI_ISSUES_PREFIX = `https://github.com/medusajs/ui/issues/new?labels=documentation`

export const navDropdownItems: NavigationItem[] = [
  {
    type: "link",
    path: `/v2/learn`,
    title: "Get Started",
    project: "book",
  },
  {
    type: "dropdown",
    title: "Product",
    children: [
      {
        type: "link",
        title: "Commerce Modules",
        link: "/v2/resources/commerce-modules",
      },
      {
        type: "link",
        title: "Architectural Modules",
        link: "/v2/resources/architectural-modules",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Resources",
    children: [
      {
        type: "link",
        title: "Guides",
        link: "/v2/resources",
        useAsFallback: true,
      },
      {
        type: "link",
        title: "Examples",
        link: "/v2/resources/examples",
      },
      {
        type: "link",
        title: "Recipes",
        link: "/v2/resources/recipes",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Admin Components",
        link: "/v2/resources/admin-components",
      },
      {
        type: "link",
        title: "Storefront Development",
        link: "/v2/resources/storefront-development",
      },
      {
        type: "link",
        title: "UI Library",
        link: "/ui",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Tools & SDKs",
    children: [
      {
        type: "link",
        title: "Medusa CLI",
        link: "/v2/resources/medusa-cli",
      },
      {
        type: "link",
        title: "JS SDK",
        link: "/v2/resources/js-sdk",
      },
      {
        type: "link",
        title: "Next.js Starter",
        link: "/v2/resources/nextjs-starter",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Integrations",
        link: "/v2/resources/integrations",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Framework",
    children: [
      {
        type: "link",
        title: "API Routes",
        link: "/v2/learn/basics/api-routes",
      },
      {
        type: "link",
        title: "Modules",
        link: "/v2/learn/basics/modules",
      },
      {
        type: "link",
        title: "Subscribers",
        link: "/v2/learn/basics/events-and-subscribers",
      },
      {
        type: "link",
        title: "Scheduled Jobs",
        link: "/v2/learn/basics/scheduled-jobs",
      },
      {
        type: "link",
        title: "Loaders",
        link: "/v2/learn/basics/loaders",
      },
      {
        type: "link",
        title: "Admin Customizations",
        link: "/v2/learn/basics/admin-customizations",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Links",
        link: "/v2/learn/advanced-development/module-links",
      },
      {
        type: "link",
        title: "Query",
        link: "/v2/learn/advanced-development/module-links/query",
      },
      {
        type: "link",
        title: "Data Models",
        link: "/v2/learn/advanced-development/data-models",
      },
      {
        type: "link",
        title: "Workflows",
        link: "/v2/learn/basics/workflows",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Reference",
    children: [
      {
        type: "link",
        title: "Admin API",
        link: "/v2/api/admin",
      },
      {
        type: "link",
        title: "Store API",
        link: "/v2/api/store",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Workflows",
        link: "/v2/resources/medusa-workflows-reference",
      },
      {
        type: "link",
        title: "Data Model API",
        link: "/v2/resources/references/data-model",
      },
      {
        type: "link",
        title: "Service Factory",
        link: "/v2/resources/service-factory-reference",
      },
      {
        type: "link",
        title: "Events Reference",
        link: "/v2/resources/events-reference",
      },
      {
        type: "link",
        title: "Admin Widget Injection Zones",
        link: "/v2/resources/admin-widget-injection-zones",
      },
    ],
  },
]

export const searchFilters: OptionType[] = [
  {
    value: "guides",
    label: "Guides",
  },
  {
    value: "references-v2",
    label: "References",
  },
  {
    value: "admin-v2",
    label: "Admin API (v2)",
  },
  {
    value: "store-v2",
    label: "Store API (v2)",
  },
  {
    value: "ui",
    label: "Medusa UI",
  },
  // TODO add more filters
]
