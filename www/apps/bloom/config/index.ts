import { DocsConfig, Sidebar } from "types"
import { generatedSidebars } from "@/generated/sidebar.mjs"
import { globalConfig } from "docs-ui"
import { basePathUrl } from "../utils/base-path-url"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

export const config: DocsConfig = {
  ...globalConfig,
  titleSuffix: "Bloom Documentation",
  description:
    "Learn about Bloom. Bloom is an AI-powered commerce assistant by Medusa that helps you build, manage, and scale your ecommerce store. Find documentation on getting started, features, and more.",
  baseUrl,
  basePath,
  sidebars: generatedSidebars as Sidebar.Sidebar[],
  project: {
    title: "Bloom",
    key: "bloom",
  },
  logo: basePathUrl("/images/logo.png"),
  breadcrumbOptions: {
    startItems: [
      {
        title: "Documentation",
        link: basePathUrl("/"),
      },
    ],
  },
  version: {
    ...globalConfig.version,
    hide: true,
  },
  features: {
    aiAssistant: false,
  },
}
