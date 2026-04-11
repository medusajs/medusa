import { DocsConfig } from "types"
import { globalConfig } from "docs-ui"
import { basePathUrl } from "../utils/base-path-url"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  ...globalConfig,
  titleSuffix: "Medusa Documentation",
  description:
    "Explore Medusa's recipes, Commerce and Infrastructure modules, API and SDK references, storefront guides, how-to guides, tutorials, and more.",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebars: [],
  project: {
    title: "Development Resources",
    key: "resources",
  },
  breadcrumbOptions: {
    startItems: [
      {
        title: "Documentation",
        link: baseUrl,
      },
    ],
  },
  logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo.png`,
  version: {
    ...globalConfig.version,
    bannerImage: {
      light: basePathUrl("/images/release.png"),
      dark: basePathUrl("/images/release-dark.png"),
    },
  },
}
