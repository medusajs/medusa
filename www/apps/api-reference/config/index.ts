import { globalConfig } from "docs-ui"
import { DocsConfig } from "types"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  ...globalConfig,
  titleSuffix: "Medusa API Reference",
  description:
    "Comprehensive reference for Medusa's API routes, request/response structures, authentication methods, and error handling.",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  // sidebar is auto generated
  sidebars: [
    {
      sidebar_id: "api-ref",
      title: "API Reference",
      items: [],
    },
  ],
  project: {
    title: "API Reference",
    key: "api-reference",
  },
  logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo.png`,
}
