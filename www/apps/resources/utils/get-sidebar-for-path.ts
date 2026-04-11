import { Sidebar } from "types"

const getDefaultSidebar = async (): Promise<{ default: Sidebar.Sidebar }> => ({
  default: {
    sidebar_id: "default",
    title: "",
    items: [],
  },
})

const sidebarMappings: {
  module: () => Promise<{ default: Sidebar.Sidebar }>
  paths: string[]
}[] = [
  {
    module: async () =>
      import("@/generated/generated-recipes-sidebar.mjs") as Promise<{
        default: Sidebar.Sidebar
      }>,
    paths: ["/recipes/"],
  },
  {
    module: async () =>
      import("@/generated/generated-how-to-tutorials-sidebar.mjs") as Promise<{
        default: Sidebar.Sidebar
      }>,
    paths: [
      "/how-to-tutorials",
      "/examples",
      "/admin-components",
      "/plugins/guides",
      "/deployment",
    ],
  },
  {
    module: async () =>
      import("@/generated/generated-integrations-sidebar.mjs") as Promise<{
        default: Sidebar.Sidebar
      }>,
    paths: ["/integrations"],
  },
  {
    module: async () =>
      import(
        "@/generated/generated-storefront-development-sidebar.mjs"
      ) as Promise<{ default: Sidebar.Sidebar }>,
    paths: ["/storefront-development"],
  },
  {
    module: async () =>
      import("@/generated/generated-tools-sidebar.mjs") as Promise<{
        default: Sidebar.Sidebar
      }>,
    paths: [
      "/tools",
      "/create-medusa-app",
      "/medusa-cli",
      "/js-sdk",
      "/nextjs-starter",
      "/references/js-sdk",
    ],
  },
  {
    module: async () =>
      import(
        "@/generated/generated-infrastructure-modules-sidebar.mjs"
      ) as Promise<{
        default: Sidebar.Sidebar
      }>,
    paths: [
      "/infrastructure-modules",
      "/references/file-provider-module",
      "/references/locking",
      "/references/notification-provider-module",
      "/references/notification-service",
      "/references/event-service",
      "/references/cache-service",
      "/references/file-service",
      "/references/analytics",
      "/references/caching-service",
      "/references/caching-module-provider",
    ],
  },
  {
    module: async () =>
      import("@/generated/generated-commerce-modules-sidebar.mjs") as Promise<{
        default: Sidebar.Sidebar
      }>,
    paths: [
      "/commerce-modules",
      "/references/api-key",
      "/references/auth",
      "/references/cart",
      "/references/currency",
      "/references/customer",
      "/references/fulfillment",
      "/references/inventory",
      "/references/order",
      "/references/payment",
      "/references/pricing",
      "/references/product",
      "/references/promotion",
      "/references/region",
      "/references/sales-channel",
      "/references/stock-location",
      "/references/store",
      "/references/tax",
      "/references/translation",
      "/references/user",
    ],
  },
  {
    module: async () =>
      import("@/generated/generated-references-sidebar.mjs") as Promise<{
        default: Sidebar.Sidebar
      }>,
    paths: [
      "/admin-widget-injection-zones",
      "/medusa-container-resources",
      "/medusa-workflows-reference",
      "/references/core-flows",
      "/references/data-model",
      "/references/events",
      "/references/helper-steps",
      "/service-factory-reference",
      "/test-tools-reference",
      "/references/workflows",
      "/references-overview",
      "/references/medusa-workflows",
      "/data-model-repository-reference",
    ],
  },
  {
    module: async () =>
      import("@/generated/generated-troubleshooting-sidebar.mjs") as Promise<{
        default: Sidebar.Sidebar
      }>,
    paths: ["/troubleshooting"],
  },
]
export async function getSidebarForPath(
  currentPath: string
): Promise<Sidebar.Sidebar> {
  const sidebarMapping = sidebarMappings.find(({ paths }) =>
    paths.some((path) => {
      if (currentPath.startsWith(path)) {
        return true
      }

      const regex = new RegExp(`^${path.replace(/\/$/, "")}(/|$)`)
      return regex.test(currentPath)
    })
  )

  if (sidebarMapping) {
    const sidebarModule = await sidebarMapping.module()
    return sidebarModule.default
  }

  return await getDefaultSidebar().then((module) => module.default)
}
