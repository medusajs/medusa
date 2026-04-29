import { DocsConfig, Sidebar } from "types"
import { generatedSidebars } from "@/generated/sidebar.mjs"
import { globalConfig } from "docs-ui"
import { basePathUrl } from "../utils/base-path-url"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  ...globalConfig,
  titleSuffix: "Medusa Cloud Documentation",
  description:
    "Learn about Cloud, Medusa's PaaS offering for scalable deployments. Learn how to sign up, deploy, and manage your Medusa Cloud projects.",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebars: generatedSidebars as Sidebar.Sidebar[],
  project: {
    title: "Cloud",
    key: "cloud",
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
    bannerImage: {
      light: basePathUrl("/images/release.png"),
      dark: basePathUrl("/images/release-dark.png"),
    },
  },
}
