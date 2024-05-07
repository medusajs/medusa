import { DocsConfig } from "types"
import { mobileSidebarItemsV2 } from "docs-ui"
import { generatedSidebar } from "../generated/sidebar.mjs"

export const config: DocsConfig = {
  titleSuffix: "Medusa Resources",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebar: {
    top: generatedSidebar,
    bottom: [],
    mobile: mobileSidebarItemsV2,
  },
}
