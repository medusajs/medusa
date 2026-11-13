import { NavigationItem, Product } from "types"

export const GITHUB_ISSUES_LINK =
  "https://github.com/medusajs/medusa/issues/new/choose"

export const CLOUD_STATUS_PAGE_URL = "https://status.medusajs.com"

export const navDropdownItems: NavigationItem[] = [
  {
    type: "link",
    link: `/cloud`,
    title: "Get Started",
    sidebar_id: "get-started",
  },
  {
    type: "link",
    link: "/resources/commerce-modules",
    title: "Commerce",
    sidebar_id: "commerce-modules",
  },
  {
    type: "dropdown",
    title: "Build",
    children: [
      {
        type: "link",
        title: "Framework",
        link: "/learn",
        sidebar_id: "framework",
      },
      {
        type: "link",
        title: "Storefront Development",
        link: "/resources/storefront-development",
        sidebar_id: "storefront-development",
      },
      {
        type: "link",
        title: "Recipes",
        link: "/resources/recipes",
        sidebar_id: "recipes",
      },
      {
        type: "link",
        title: "How to & Tutorials",
        link: "/resources/how-to-tutorials",
        sidebar_id: "how-to-tutorials",
      },
    ],
  },
  {
    type: "link",
    title: "Merchant Guide",
    link: "/user-guide",
    sidebar_id: "user-guide",
  },
  {
    type: "dropdown",
    title: "Developer Resources",
    children: [
      {
        type: "sub-menu",
        title: "Tools",
        link: "/resources/tools",
        items: [
          {
            type: "link",
            title: "Cloud CLI",
            link: "/cloud/cli",
            sidebar_id: "cloud-cli",
          },
          {
            type: "link",
            title: "Medusa CLI",
            link: "/resources/medusa-cli",
            sidebar_id: "medusa-cli",
          },
          {
            type: "link",
            title: "InstantSearch Adapter",
            link: "/resources/instantsearch",
          },
          {
            type: "link",
            title: "JS SDK",
            link: "/resources/js-sdk",
            sidebar_id: "js-sdk",
          },
          {
            type: "link",
            title: "ESLint Plugin",
            link: "/resources/lint",
            sidebar_id: "lint",
          },
          {
            type: "link",
            title: "Admin Components",
            link: "/resources/admin-components",
            sidebar_id: "admin-components",
          },
          {
            type: "link",
            title: "Next.js Starter",
            link: "/resources/nextjs-starter",
            sidebar_id: "nextjs-starter",
          },
          {
            type: "link",
            title: "Medusa UI",
            link: "/ui",
            sidebar_id: "ui",
          },
        ],
      },
      {
        type: "sub-menu",
        title: "References",
        link: "/resources/references-overview",
        items: [
          {
            type: "link",
            title: "Admin API",
            link: "/api/admin",
            sidebar_id: "admin",
          },
          {
            type: "link",
            title: "Store API",
            link: "/api/store",
            sidebar_id: "store",
          },
          {
            type: "divider",
          },
          {
            type: "link",
            title: "Admin Injection Zones",
            link: "/resources/admin-widget-injection-zones",
          },
          {
            type: "link",
            title: "Container Resources",
            link: "/resources/medusa-container-resources",
          },
          {
            type: "link",
            title: "Core Workflows",
            link: "/resources/medusa-workflows-reference",
            sidebar_id: "core-flows",
          },
          {
            type: "link",
            title: "Data Model Language",
            link: "/resources/references/data-model",
            sidebar_id: "dml-reference",
          },
          {
            type: "link",
            title: "Data Model Repository",
            link: "/resources/data-model-repository-reference",
            sidebar_id: "data-model-repository-reference",
          },
          {
            type: "link",
            title: "Events Reference",
            link: "/resources/references/events",
          },
          {
            type: "link",
            title: "Helper Steps",
            link: "/resources/references/helper-steps",
            sidebar_id: "helper-steps-reference",
          },
          {
            type: "link",
            title: "Service Factory",
            link: "/resources/service-factory-reference",
            sidebar_id: "service-factory-reference",
          },
          {
            type: "link",
            title: "Testing Framework",
            link: "/resources/test-tools-reference",
            sidebar_id: "test-tools-reference",
          },
          {
            type: "link",
            title: "Workflows SDK",
            link: "/resources/references/workflows",
            sidebar_id: "workflows-sdk-reference",
          },
        ],
      },
    ],
  },
]

export const products: Product[] = [
  {
    type: "commerce",
    name: "api key",
    path: "/resources/commerce-modules/api-key",
    title: "API Key",
    image: "/images/api-key-icon.png",
  },
  {
    type: "commerce",
    name: "auth",
    path: "/resources/commerce-modules/auth",
    title: "Auth",
    image: "/images/auth-icon.png",
  },
  {
    type: "commerce",
    name: "cart",
    path: "/resources/commerce-modules/cart",
    title: "Cart",
    image: "/images/cart-icon.png",
  },
  {
    type: "commerce",
    name: "currency",
    path: "/resources/commerce-modules/currency",
    title: "Currency",
    image: "/images/currency-icon.png",
  },
  {
    type: "commerce",
    name: "customer",
    path: "/resources/commerce-modules/customer",
    title: "Customer",
    image: "/images/customer-icon.png",
  },
  {
    type: "commerce",
    name: "fulfillment",
    path: "/resources/commerce-modules/fulfillment",
    title: "Fulfillment",
    image: "/images/fulfillment-icon.png",
  },
  {
    type: "commerce",
    name: "inventory",
    path: "/resources/commerce-modules/inventory",
    title: "Inventory",
    image: "/images/inventory-icon.png",
  },
  {
    type: "commerce",
    name: "order",
    path: "/resources/commerce-modules/order",
    title: "Order",
    image: "/images/order-icon.png",
  },
  {
    type: "commerce",
    name: "payment",
    path: "/resources/commerce-modules/payment",
    title: "Payment",
    image: "/images/payment-icon.png",
  },
  {
    type: "commerce",
    name: "pricing",
    path: "/resources/commerce-modules/pricing",
    title: "Pricing",
    image: "/images/pricing-icon.png",
  },
  {
    type: "commerce",
    name: "product",
    path: "/resources/commerce-modules/product",
    title: "Product",
    image: "/images/product-icon.png",
  },
  {
    type: "commerce",
    name: "promotion",
    path: "/resources/commerce-modules/promotion",
    title: "Promotion",
    image: "/images/promotion-icon.png",
  },
  {
    type: "commerce",
    name: "region",
    path: "/resources/commerce-modules/region",
    title: "Region",
    image: "/images/region-icon.png",
  },
  {
    type: "commerce",
    name: "sales channel",
    path: "/resources/commerce-modules/sales-channel",
    title: "Sales Channel",
    image: "/images/sales-channel-icon.png",
  },
  {
    type: "commerce",
    name: "stock location",
    path: "/resources/commerce-modules/stock-location",
    title: "Stock Location",
    image: "/images/stock-location-icon.png",
  },
  // TODO need an image for this one
  // {
  //   type: "commerce",
  //   name: "store",
  //   title: "Store",
  //   image: "/images/store-icon.png",
  // },
  {
    type: "commerce",
    name: "tax",
    path: "/resources/commerce-modules/tax",
    title: "Tax",
    image: "/images/tax-icon.png",
  },
  {
    type: "commerce",
    name: "user",
    path: "/resources/commerce-modules/user",
    title: "User",
    image: "/images/user-icon.png",
  },
]

export enum DocsTrackingEvents {
  SURVEY = "survey",
  SURVEY_API = "survey_api-ref",
  CODE_BLOCK_COPY = "code_block_copy",
  AI_ASSISTANT_START_CHAT = "ai_assistant_start_chat",
  AI_ASSISTANT_CALLOUT_CLICK = "ai_assistant_callout_click",
  SEARCH_CALLOUT_CLICK = "search_callout_click",
  BLOOM_ACTION = "bloom_action",
  WHATS_NEW_ITEM_CLICK = "whats_new_item_click",
}
