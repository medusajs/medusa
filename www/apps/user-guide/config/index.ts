import { DocsConfig } from "types"
import { getMobileSidebarItems } from "docs-ui"
import { generatedSidebar as sidebar } from "@/generated/sidebar.mjs"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  titleSuffix: "Medusa Admin User Guide",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebar: {
    top: sidebar,
    bottom: [],
    mobile: getMobileSidebarItems({
      baseUrl,
      version: "v2",
    }),
  },
}
