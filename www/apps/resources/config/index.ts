import { DocsConfig, SidebarItem } from "types"
import { generatedSidebar } from "../generated/sidebar.mjs"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  titleSuffix: "Medusa Development Resources",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebar: {
    default: generatedSidebar as SidebarItem[],
    mobile: [],
  },
  project: {
    title: "Development Resources",
    key: "resources",
  },
  breadcrumbOptions: {
    showCategories: true,
  },
}
