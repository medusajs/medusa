import { DocsConfig } from "types"
import { mobileSidebarItemsV2 } from "docs-ui"

export const config: DocsConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
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
    mobile: mobileSidebarItemsV2,
  },
}
