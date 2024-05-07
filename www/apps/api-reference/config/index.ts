import { DocsConfig } from "types"
import { mobileSidebarItemsV1, legacyMobileSidebarItems } from "docs-ui"

export const config: DocsConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
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
    mobile: process.env.NEXT_PUBLIC_SHOW_V2 ? mobileSidebarItemsV1 : legacyMobileSidebarItems,
  },
}
