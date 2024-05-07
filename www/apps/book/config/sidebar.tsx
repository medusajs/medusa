import { Badge, mobileSidebarItemsV2 } from "docs-ui"
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

export const sidebarConfig: SidebarConfig = {
  top: normalizeSidebarItems(sidebar),
  bottom: [],
  mobile: mobileSidebarItemsV2,
}
