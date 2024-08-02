import { Badge, getMobileSidebarItems } from "docs-ui"
import type { SidebarConfig, SidebarItem } from "@/types"
import { sidebar } from "../sidebar.mjs"

const soonBadge = <Badge variant="blue">Soon</Badge>

const normalizeSidebarItems = (items: SidebarItem[]) =>
  items.map((item) => {
    if (item.type === "separator") {
      return item
    }
    if (item.isSoon) {
      item.additionalElms = soonBadge
    }

    if (item.children) {
      item.children = normalizeSidebarItems(item.children as SidebarItem[])
    }

    return item
  })

export const sidebarConfig = (baseUrl: string): SidebarConfig => {
  return {
    default: normalizeSidebarItems(sidebar),
    mobile: getMobileSidebarItems({
      baseUrl,
      version: "v2",
    }),
  }
}
