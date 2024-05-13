import { DocsConfig } from "types"
import { mobileSidebarItemsV2 } from "docs-ui"
import { generatedSidebar as sidebar } from "@/generated/sidebar.mjs"

export const config: DocsConfig = {
  titleSuffix: "Medusa Admin User Guide",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebar: {
    top: sidebar,
    bottom: [],
    mobile: mobileSidebarItemsV2,
  },
}
