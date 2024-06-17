import { DocsConfig } from "types"
import { sidebarConfig } from "./sidebar"

export const config: DocsConfig = {
  titleSuffix: "Medusa v2 Docs",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebar: sidebarConfig,
}
