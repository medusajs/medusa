import { DocsConfig } from "types"
import { getMobileSidebarItems } from "docs-ui"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  // sidebar is auto generated
  sidebar: {
    top: [
      {
        title: "Introduction",
        path: "",
        loaded: true,
      },
    ],
    bottom: [],
    mobile: getMobileSidebarItems({
      baseUrl,
      version: "v2",
    }),
  },
}
