import { DocsConfig } from "types"
import { sidebarConfig } from "./sidebar"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  titleSuffix: "Medusa v2 Docs",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebar: sidebarConfig(baseUrl),
}
