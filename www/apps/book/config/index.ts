import { DocsConfig } from "types"
import { sidebarConfig } from "./sidebar"
import { globalConfig } from "docs-ui"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  ...globalConfig,
  titleSuffix: "Medusa v2 Documentation",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebar: sidebarConfig,
  project: {
    title: "Documentation",
    key: "book",
  },
  breadcrumbOptions: {
    showCategories: false,
  },
}
