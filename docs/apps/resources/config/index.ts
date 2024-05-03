import { DocsConfig } from "types"
import { mobileSidebarItems } from "docs-ui"
import { generatedSidebar } from "../generated/sidebar.mjs"

export const config: DocsConfig = {
  titleSuffix: "Medusa Resources",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  sidebar: {
    top: generatedSidebar,
    bottom: [],
    mobile: mobileSidebarItems,
  },
}
