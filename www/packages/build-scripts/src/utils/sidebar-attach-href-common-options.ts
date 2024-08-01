import { RawSidebarItem } from "types"

const commonOptions: Partial<RawSidebarItem> = {
  loaded: true,
  isPathHref: true,
}

export function sidebarAttachHrefCommonOptions(
  sidebar: RawSidebarItem[]
): RawSidebarItem[] {
  return sidebar.map((item) => {
    if (item.type === "separator") {
      return item
    }

    return {
      ...commonOptions,
      ...item,
      children: sidebarAttachHrefCommonOptions(item.children || []),
    }
  })
}
