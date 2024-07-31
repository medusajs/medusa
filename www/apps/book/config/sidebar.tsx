import { Badge, getMobileSidebarItems } from "docs-ui"
import type { SidebarConfig, SidebarItemType } from "@/types"
import { sidebar } from "../sidebar.mjs"

const soonBadge = <Badge variant="blue">Soon</Badge>

const normalizeSidebarItems = (items: SidebarItemType[]) =>
  items.map((item) => {
    if (item.isSoon) {
      item.additionalElms = soonBadge
    }

    if (item.children) {
      item.children = normalizeSidebarItems(item.children as SidebarItemType[])
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
