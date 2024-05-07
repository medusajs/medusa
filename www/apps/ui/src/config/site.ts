import { DocsConfig } from "types"

type SiteConfig = {
  name: string
  url: string
  description: string
} & DocsConfig

const baseUrl = process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:3000"

export const siteConfig: SiteConfig = {
  name: "Medusa UI",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  url: `${baseUrl}/${process.env.NEXT_PUBLIC_BASE_PATH}`,
  description: "Primitives for building Medusa applications.",
  // sidebar is defined in docs.tsx
  sidebar: {
    top: [],
    bottom: [],
    mobile: [],
  },
}
