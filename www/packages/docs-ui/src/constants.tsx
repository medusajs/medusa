import { NavigationItem, Product } from "types"

export const GITHUB_ISSUES_LINK =
  "https://github.com/medusajs/medusa/issues/new/choose"

export const navDropdownItems: NavigationItem[] = [
  {
    type: "link",
    link: `/learn`,
    title: "Get Started",
    sidebar_id: "docs",
  },
  {
    type: "dropdown",
    title: "Product",
    children: [
      {
        type: "sub-menu",
        title: "Framework",
        link: "/learn/fundamentals/framework",
        items: [
          {
            type: "link",
            title: "API Routes",
            link: "/learn/fundamentals/api-routes",
          },
          {
            type: "link",
            title: "Data Models",
            link: "/learn/fundamentals/data-models",
          },
          {
            type: "link",
            title: "Events and Subscribers",
            link: "/learn/fundamentals/events-and-subscribers",
          },
          {
            type: "link",
            title: "Index Module",
            link: "/learn/fundamentals/module-links/index-module",
          },
          {
            type: "link",
            title: "Medusa Container",
            link: "/learn/fundamentals/medusa-container",
          },
          {
            type: "link",
            title: "Modules",
            link: "/learn/fundamentals/modules",
          },
          {
            type: "link",
            title: "Module Links",
            link: "/learn/fundamentals/module-links",
          },
          {
            type: "link",
            title: "Plugins",
            link: "/learn/fundamentals/plugins",
          },
          {
            type: "link",
            title: "Query",
            link: "/learn/fundamentals/module-links/query",
          },
          {
            type: "link",
            title: "Scheduled Jobs",
            link: "/learn/fundamentals/scheduled-jobs",
          },
          {
            type: "link",
            title: "Workflows",
            link: "/learn/fundamentals/workflows",
          },
        ],
      },
      {
        type: "link",
        title: "Admin Extensions",
        link: "/learn/fundamentals/admin",
      },
      {
        type: "sub-menu",
        title: "Commerce Modules",
        link: "/resources/commerce-modules",
        items: [
          {
            type: "link",
            title: "API Key",
            link: "/resources/commerce-modules/api-key",
          },
          {
            type: "link",
            title: "Auth",
            link: "/resources/commerce-modules/auth",
          },
          {
            type: "link",
            title: "Cart",
            link: "/resources/commerce-modules/cart",
          },
          {
            type: "link",
            title: "Currency",
            link: "/resources/commerce-modules/currency",
          },
          {
            type: "link",
            title: "Customer",
            link: "/resources/commerce-modules/customer",
          },
          {
            type: "link",
            title: "Fulfillment",
            link: "/resources/commerce-modules/fulfillment",
          },
          {
            type: "link",
            title: "Inventory",
            link: "/resources/commerce-modules/inventory",
          },
          {
            type: "link",
            title: "Order",
            link: "/resources/commerce-modules/order",
          },
          {
            type: "link",
            title: "Payment",
            link: "/resources/commerce-modules/payment",
          },
          {
            type: "link",
            title: "Pricing",
            link: "/resources/commerce-modules/pricing",
          },
          {
            type: "link",
            title: "Product",
            link: "/resources/commerce-modules/product",
          },
          {
            type: "link",
            title: "Promotion",
            link: "/resources/commerce-modules/promotion",
          },
          {
            type: "link",
            title: "Region",
            link: "/resources/commerce-modules/region",
          },
          {
            type: "link",
            title: "Sales Channel",
            link: "/resources/commerce-modules/sales-channel",
          },
          {
            type: "link",
            title: "Stock Location",
            link: "/resources/commerce-modules/stock-location",
          },
          {
            type: "link",
            title: "Store",
            link: "/resources/commerce-modules/store",
          },
          {
            type: "link",
            title: "Tax",
            link: "/resources/commerce-modules/tax",
          },
          {
            type: "link",
            title: "Translation",
            link: "/resources/commerce-modules/translation",
          },
          {
            type: "link",
            title: "User",
            link: "/resources/commerce-modules/user",
          },
        ],
      },
      {
        type: "sub-menu",
        title: "Infrastructure Modules",
        link: "/resources/infrastructure-modules",
        sidebar_id: "infrastructure-modules",
        items: [
          {
            type: "link",
            title: "Analytics",
            link: "/resources/infrastructure-modules/analytics",
          },
          {
            type: "link",
            title: "Caching",
            link: "/resources/infrastructure-modules/caching",
          },
          {
            type: "link",
            title: "Event",
            link: "/resources/infrastructure-modules/event",
          },
          {
            type: "link",
            title: "File",
            link: "/resources/infrastructure-modules/file",
          },
          {
            type: "link",
            title: "Locking",
            link: "/resources/infrastructure-modules/locking",
          },
          {
            type: "link",
            title: "Notification",
            link: "/resources/infrastructure-modules/notification",
          },
          {
            type: "link",
            title: "Workflow Engine",
            link: "/resources/infrastructure-modules/workflow-engine",
          },
        ],
      },
    ],
  },
  {
    type: "dropdown",
    title: "Build",
    children: [
      {
        type: "link",
        title: "Recipes",
        link: "/resources/recipes",
        sidebar_id: "recipes",
      },
      {
        type: "link",
        title: "How-to & Tutorials",
        link: "/resources/how-to-tutorials",
        sidebar_id: "how-to-tutorials",
      },
      {
        type: "link",
        title: "Integrations",
        link: "/resources/integrations",
        sidebar_id: "integrations",
      },
      {
        type: "link",
        title: "Storefront",
        link: "/resources/storefront-development",
        sidebar_id: "storefront-development",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Tools",
    link: "/resources/tools",
    children: [
      {
        type: "sub-menu",
        title: "CLI Tools",
        items: [
          {
            type: "link",
            title: "create-medusa-app",
            link: "/resources/create-medusa-app",
          },
          {
            type: "link",
            title: "Medusa CLI",
            link: "/resources/medusa-cli",
          },
        ],
      },
      {
        type: "link",
        title: "JS SDK",
        link: "/resources/js-sdk",
        sidebar_id: "js-sdk",
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
    type: "dropdown",
    title: "Reference",
    link: "/resources/references-overview",
    children: [
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
  {
    type: "link",
    title: "User Guide",
    link: "/user-guide",
    sidebar_id: "user-guide",
  },
  {
    type: "link",
    title: "Cloud",
    link: "/cloud",
    sidebar_id: "cloud",
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
}
