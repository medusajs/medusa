import { OptionType } from "@/hooks"
import { NavigationItem } from "types"

export const GITHUB_ISSUES_PREFIX = `https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml`
export const GITHUB_UI_ISSUES_PREFIX = `https://github.com/medusajs/ui/issues/new?labels=documentation`

export const navDropdownItems: NavigationItem[] = [
  {
    type: "link",
    path: `/learn`,
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
        link: "/resources/commerce-modules",
      },
      {
        type: "link",
        title: "Architectural Modules",
        link: "/resources/architectural-modules",
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
        link: "/resources",
        useAsFallback: true,
      },
      {
        type: "link",
        title: "Examples",
        link: "/resources/examples",
      },
      {
        type: "link",
        title: "Recipes",
        link: "/resources/recipes",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Admin Components",
        link: "/resources/admin-components",
      },
      {
        type: "link",
        title: "Storefront Development",
        link: "/resources/storefront-development",
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
        link: "/resources/medusa-cli",
      },
      {
        type: "link",
        title: "JS SDK",
        link: "/resources/js-sdk",
      },
      {
        type: "link",
        title: "Next.js Starter",
        link: "/resources/nextjs-starter",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Integrations",
        link: "/resources/integrations",
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
        link: "/learn/basics/api-routes",
      },
      {
        type: "link",
        title: "Modules",
        link: "/learn/basics/modules",
      },
      {
        type: "link",
        title: "Subscribers",
        link: "/learn/basics/events-and-subscribers",
      },
      {
        type: "link",
        title: "Scheduled Jobs",
        link: "/learn/basics/scheduled-jobs",
      },
      {
        type: "link",
        title: "Loaders",
        link: "/learn/basics/loaders",
      },
      {
        type: "link",
        title: "Admin Customizations",
        link: "/learn/basics/admin-customizations",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Links",
        link: "/learn/advanced-development/module-links",
      },
      {
        type: "link",
        title: "Query",
        link: "/learn/advanced-development/module-links/query",
      },
      {
        type: "link",
        title: "Data Models",
        link: "/learn/advanced-development/data-models",
      },
      {
        type: "link",
        title: "Workflows",
        link: "/learn/basics/workflows",
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
        link: "/api/admin",
      },
      {
        type: "link",
        title: "Store API",
        link: "/api/store",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Workflows",
        link: "/resources/medusa-workflows-reference",
      },
      {
        type: "link",
        title: "Data Model API",
        link: "/resources/references/data-model",
      },
      {
        type: "link",
        title: "Service Factory",
        link: "/resources/service-factory-reference",
      },
      {
        type: "link",
        title: "Events Reference",
        link: "/resources/events-reference",
      },
      {
        type: "link",
        title: "Admin Widget Injection Zones",
        link: "/resources/admin-widget-injection-zones",
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
