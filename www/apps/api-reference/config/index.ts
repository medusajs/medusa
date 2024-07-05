import { DocsConfig } from "types"
import { mobileSidebarItems } from "docs-ui"

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
    mobile: mobileSidebarItems,
  },
}
