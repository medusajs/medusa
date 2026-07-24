import { Sidebar } from "types"

const commonOptions: Partial<Sidebar.RawSidebarItem> = {
  loaded: true,
}

export function sidebarAttachCommonOptions(
  sidebar: Sidebar.RawSidebarItem[]
): Sidebar.RawSidebarItem[] {
  return sidebar.map((item) => {
    if (item.type === "separator") {
      return item
    }

    return {
      ...commonOptions,
      ...item,
      children: sidebarAttachCommonOptions(item.children || []),
    }
  })
}
