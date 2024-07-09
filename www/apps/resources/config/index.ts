import { DocsConfig } from "types"
import { getMobileSidebarItems } from "docs-ui"
import { generatedSidebar } from "../generated/sidebar.mjs"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  titleSuffix: "Medusa Learning Resources",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebar: {
    top: generatedSidebar,
    bottom: [],
    mobile: getMobileSidebarItems({
      baseUrl,
      version: "v2",
    }),
  },
}
