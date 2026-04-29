import { DocsConfig, Sidebar } from "types"
import { generatedSidebars } from "@/generated/sidebar.mjs"
import { globalConfig } from "docs-ui"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  ...globalConfig,
  titleSuffix: "Medusa UI",
  description:
    "Learn about Medusa UI, A React package with primitives for building Medusa applications. Explore components, hooks, colors, icons, and more.",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebars: generatedSidebars as Sidebar.Sidebar[],
  project: {
    title: "UI",
    key: "ui",
  },
  logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo.png`,
  breadcrumbOptions: {
    startItems: [
      {
        title: "Documentation",
        link: baseUrl,
      },
    ],
  },
  version: {
    ...globalConfig.version,
    hide: true,
  },
}
